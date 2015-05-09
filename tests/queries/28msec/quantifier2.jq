declare %an:nondeterministic function local:cleanup($report as item) as item*
{
  (: add Ids everywhere :)
  copy $report := $report
  modify
  (
    for $object in descendant-objects($report)
    where exists($object.Name) and not(exists($object.Id))
    return
      insert json { "Id": 1 } into $object
  )
  return $report
};

()
