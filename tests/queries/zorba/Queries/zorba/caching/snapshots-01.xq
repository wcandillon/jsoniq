declare namespace an = "http://zorba.io/annotations";

declare %an:strictlydeterministic function local:test-03-sd() 
{
  { "a" : 1 },
  [1],
  <a/>,
  1
};

variable $x :=  (local:test-03-sd(), local:test-03-sd());


replace value of json $x[1]("a") with 2;
append json (2) into $x[2];

fn:deep-equal($x[1], $x[5]),
fn:deep-equal($x[2], [1,2]),
fn:deep-equal($x[2], $x[6]),
($x[3] is $x[7]),
fn:deep-equal($x[4], $x[8])