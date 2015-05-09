xquery version "3.0";
module namespace queue = "http://portal.28.io/scheduler/queue";

import module namespace db = "http://zorba.io/modules/store/static/collections/dml";
import module namespace idx = "http://zorba.io/modules/store/static/indexes/dml";

import module namespace rand = "http://zorba.io/modules/random";
import module namespace mongo = "http://www.28msec.com/modules/mongodb";   
import module namespace store = "http://www.28msec.com/modules/store";


(: ----------------------------- Collection --------------------------------- :)

(: Queue containing jobs :)
declare variable $queue:jobs as xs:QName := xs:QName("queue:jobs");



(: ------------------------------ Indexes ----------------------------------- :)

(: Index by UUID :)
declare %an:automatic %an:unique %an:value-equality index queue:uuid-index
  on nodes db:collection(xs:QName("queue:jobs")) by .("_id") as xs:string;

declare variable $queue:uuid-index as xs:QName := xs:QName("queue:uuid-index");

(: Index by parallel job UUID :)
declare %an:automatic %an:nonunique %an:value-equality index queue:parallel-uuid-index
  on nodes db:collection(xs:QName("queue:jobs")) by .("parallel-job") as xs:string?;

declare variable $queue:parallel-uuid-index as xs:QName := xs:QName("queue:parallel-uuid-index");

(: Index by project :)
declare %an:automatic %an:nonunique %an:value-equality index queue:project-index
  on nodes db:collection(xs:QName("queue:jobs")) by .("project")("name") as xs:string;
  
declare variable $queue:project-index as xs:QName := xs:QName("queue:project-index");

(: ---------------------- Retrieval Functions ------------------------------- :)

(: Return all jobs. :)
declare function queue:get-all-jobs() as object()*
{
    queue:get-all-jobs(())
};

(: Return all jobs. :)
declare function queue:get-all-jobs($project-name as xs:string?) as object()*
{
    if ($project-name)
    then
      idx:probe-index-point-value($queue:project-index, $project-name)
    else
      db:collection($queue:jobs)
};

(: Retrieve a job given its UUID :)
declare function queue:get-job($uuid as xs:string) as object()*
{
  let $job := idx:probe-index-point-value($queue:uuid-index, $uuid)
  return
  if (exists($job))
    then $job
    else idx:probe-index-point-value($queue:parallel-uuid-index, $uuid)
};

(: -------------------------- Insert Functions ------------------------------ :)

(: Create a new job and insert it in the queue. :)
declare %an:sequential function queue:insert-job(
    $job as object()
) as xs:string?
{
    variable $uuid := rand:uuid();

    insert json       {
        "_id" : $uuid,
        "properties" : {    
          "status" : "pending",
          "lock" : jn:null(),
          "created" : current-dateTime(),
          "accessed" : jn:null()
        }
      }
    into $job;
    
    db:insert($queue:jobs, $job);

    store:flush();

    queue:resolve-dependencies($job);

    $uuid
};

declare %an:sequential function queue:resolve-dependencies(
    $job as object()
)
{
    variable $inbound-dependencies as array()? := $job("dependencies")("in");
    variable $db := mongo:connect();
    if (exists($inbound-dependencies)) then
      for $inbound-dependency as xs:string in jn:members($inbound-dependencies)
      return {
        mongo:update(
          $db,
          "jobs", 
          {
            "_id" : $inbound-dependency,
            "properties.status" : { "$ne" : "completed" }
          },
          {
            "$push" : { "dependencies.out" : $job("_id") }
          }
        );
        variable $error := mongo:run-cmd($db, { "getLastError" : 1, "w" : 1 });
        if ($error("err") ne jn:null() or not($error("updatedExisting"))) then
        {
          if (exists(mongo:find(
              $db,
              "jobs",
              { "_id" : $inbound-dependency,
                "properties.status" : "completed" }
          ))) then
          {
            mongo:update(
              $db,
              "jobs", 
              {
                "_id" : $job("_id")
              },
              {
                "$pull" : { "dependencies.in" : $inbound-dependency }
              }
            );
            $error := mongo:run-cmd($db, { "getLastError" : 1, "w" : 1 });
            if ($error("err") ne jn:null() or not($error("updatedExisting"))) then
              error(queue:JQDY0000, "Could not remove completed inbound dependency.", $job("_id"));
            else {}
          } else {
              error(queue:JQDY0001, "Could not add an outbound dependency although it is not completed yet.", $inbound-dependency);
          }
        } else {}
      }
    else {}
};



(: --------------------------- Update Functions ----------------------------- :)

(: Update the property/field of a specific jobs given a UUID and a key. :)
declare %an:sequential function queue:set-job-property(
    $uuid as xs:string,
    $property as xs:string,
    $value) (: $value can be null :)
{
    variable $job := queue:get-job($uuid);
    variable $properties := $job("properties");
    
    if (empty($job)) then 
        ();
    else if (empty($value)) then
        replace value of json $properties($property) with jn:null();
    else
        replace value of json $properties($property) with $value;
};



(: ---------------------------- Delete Functions ---------------------------- :)

(: Remove all jobs from queue :)
declare updating function queue:delete-all-jobs()
{
    db:delete(db:collection($queue:jobs))
};

(: Remove all non "in-progress" jobs. :)
declare updating function queue:delete-inactive-jobs()
{
    for $job in db:collection($queue:jobs)
    where not($job("status") eq "in-progress")
    return db:delete($job)
};

(: Remove a specific job that does not have an "in-progress" status. :)
declare updating function queue:delete-job($uuid as xs:string)
{
    let $job := queue:get-job($uuid)
    where not($job("status") eq "in-progress")
    return db:delete($job)
};

