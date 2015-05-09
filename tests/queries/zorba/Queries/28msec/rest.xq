xquery version "3.0";
module namespace rest = "http://portal.28.io/scheduler/rest";

import module namespace queue = "http://portal.28.io/scheduler/queue";
import module namespace resp = "http://www.28msec.com/modules/http/response";
import module namespace req = "http://www.28msec.com/modules/http/request";


(: -------------------------- RESTful API ----------------------------------- :)

(: GET Collection: return UUID of all jobs. :)
declare %an:sequential function rest:get-collection($project-name as xs:string?) 
{    
    variable $jobs := queue:get-all-jobs($project-name);
    
    if (empty($jobs))
    then
      resp:set-status-code(204) (: 204 "No Content" :)
    else {
      resp:set-content-type("application/json");
      for $job in $jobs
      return 
      {
        "_id" : $job("_id"),
        "uri": req:path() || "/" || $job("_id"),
        "created": $job("properties")("created"),
        "status": $job("properties")("status"),
        "project": $job("project")("name"),
        "query" : $job("query")("name")
      }
    }
};


(: GET Job: return job corresponding to the given UUID. :)
declare %an:sequential function rest:get-resource($uuid as xs:string) 
{
    variable $job := queue:get-job($uuid);
    
    if (empty($job)) then {
        resp:set-status-code(404) (: 404 "Not Found" :)
    } else {
        resp:set-content-type("application/json");
        $job
    }
    
};


(: GET Field: return the given field value from job 
       denoted by the given UUID. :)
declare %an:sequential function rest:get-field($uuid as xs:string, $field as xs:string) 
{
   variable $value := queue:get-job($uuid)("properties")($field);
    
    if (empty($value)) then {
        resp:set-status-code(404) (: 404 "Not Found" :)
    } else {
        resp:set-content-type("application/json");
        {$field: $value} (: 200 "OK" :)
    }
};



(: POST on collection: creates a new job in queue. :)
declare %an:sequential function rest:post-collection($jobs as object()*) 
{    
    resp:set-status-code(201); (: 201 CREATED :)
    resp:set-content-type("application/json");

    try {

    for $job in $jobs
    return

    (: Check if all parameters are present. :)
    if (not(empty($job("_id"))))
    then
    {
      error(xs:QName("rest:JSDY0000"), "Forbidden uuid parameter.")
    }
    else if (not(empty($job("properties"))))
    then
    {
      error(xs:QName("rest:JSDY0000"), "Forbidden properties parameter.")
    }
    else if (empty($job("project")("name")))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing project.name parameter.")
    }
    else if (empty($job("kind")))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing kind parameter.")
    }
    else if (not($job("kind") = ("map", "execute", "shuffle")))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Bad kind parameter.")
    }
    else if ($job("kind") eq "map" and not($job("map-function")("name") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing map-function.name parameter.")
    }
    else if ($job("kind") eq "map" and not($job("map-function")("allow-streaming") instance of xs:boolean?))
    then
    {
       error(xs:QName("rest:JSDY0000"), "map-function.allow-streaming, if present, must be a boolean.")
    }
    else if ($job("kind") eq "map" and not($job("input")("collection") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing input.collection parameter.")
    }
    else if ($job("kind") = "map" and not($job("output")("collection") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing output.collection parameter.")
    }
    else if ($job("kind") eq "shuffle" and not($job("shuffle-function")("name") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing shuffle-function.name parameter.")
    }
    else if ($job("kind") eq "shuffle" and not($job("input")("collection") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing input.collection parameter.")
    }
    else if ($job("kind") eq "shuffle" and not($job("output")("collections") instance of array()))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing output.collections parameter.")
    }
    else if ($job("kind") eq "execute" and not($job("query")("name") instance of xs:string))
    then
    {
       error(xs:QName("rest:JSDY0000"), "Missing query.name parameter.")
    }
    else
    {
      (: TODO: catch exception thrown by insert function :)
      variable $uuid := queue:insert-job($job);
        
      if (empty($uuid))
      then
        error(xs:QName("rest:JSDY0000"), "An error happened.")
      else
        {"_id": $uuid}
    }
    } catch * { {
      resp:set-status-code(400);
      resp:set-content-type("text/plain");
      $err:description
    } }
};

(: PUT on field: updates field value :)
declare %an:sequential function rest:put-field($uuid as xs:string, $field as xs:string, $body-parameters as object()*)
{   
    (: Get job and its properties :)
    variable $job := queue:get-job($uuid);
    variable $job-keys := (
        if (empty($job)) 
        then () 
        else jn:keys($job("properties"))
    );
    
    (: Extract body parameters :)
    variable $body-keys := (
        if (empty($body-parameters)) 
        then () 
        else jn:keys($body-parameters)
    );
    
    (: Test if job and field exist :)
    if (empty($job) or not($field = $job-keys)) then {
        resp:set-status-code(404) (: 404 "Not Found" :)
        
    } else if (not($field = $body-keys)) then {
        (: Missing parameters :)
        resp:set-status-code(400) (: 400 "Bad Request" :)
        
    } else {
        (: update value of given field :)
        variable $value := $body-parameters($field);
        queue:set-job-property($uuid, $field, $value);
        resp:set-status-code(204) (: 204 "No Content" :)
    }
};


(: DELETE on collection: remove all jobs with status not 
   equal to "in-progress". :)
declare %an:sequential function rest:delete-collection() 
{
    queue:delete-inactive-jobs();
    resp:set-status-code(204)
};


(: DELETE on job: remove the job if its status is not equal
   to "in-progress". :)
declare %an:sequential function rest:delete-resource($uuid as xs:string)
{
    variable $job := queue:get-job($uuid);
    
    if (empty($job)) 
    then 
        resp:set-status-code(404)
    else {
        queue:delete-job($uuid);
        resp:set-status-code(204)
    }
};
