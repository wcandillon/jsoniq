import module namespace fetch = "http://zorba.io/modules/fetch";
import schema namespace mongos = "http://www.28msec.com/modules/mongodb/types";

declare variable $schema := parse-json(fetch:content("/private/ReportSchema.jq", "MODULE"));
declare variable $user := "admin@28.io";

if($user eq "admin@28.io")
then
    replace value of json $schema."_id" with "FundamentalAccountingConcepts";
else 
    {
        replace value of json $schema."_id" with $schema."_id" || substring-before($user, "@");
        delete json $schema.ACL;
    };

replace value of json $schema."Owner" with $user;

let $record := find("reports", { "_id" : $schema."_id" })
return
if(empty($record))
then insert("reports", $schema);
else edit($record, $schema);

if (is-available-collection("reportcache"))
then db:delete(find("reportcache", { "_id" : { "$regex" : mongos:regex("^" || $schema."_id" || ".*" ) }}));
else create("reportcache");
"Schema successfully deployed."
