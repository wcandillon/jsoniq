declare variable $schema := 1;

let $r := find("reports", { "_id" : $schema."_id" })
return $r;

$schema
