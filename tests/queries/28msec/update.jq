declare updating function local:test(){
  let $bar := {}
  return
      insert { "foo": 1 } into $bar
};

local:test()
