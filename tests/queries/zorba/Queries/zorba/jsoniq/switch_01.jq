let $o := { "foo" : "bar" }
return
  switch ($o.foo)
    case "bar" return 42
    case "foo" return 23
    case { "foo" : "bar" } return $o
    default return 2342
