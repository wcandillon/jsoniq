declare namespace an = "http://zorba.io/annotations";

declare %an:cache function local:test-03-cache() 
{
  { "a" : 1 },
  [1],
  <a/>,
  1
};

variable $x := local:test-03-cache();

replace value of json $x[1]("a") with 2;
append json (2) into $x[2];

variable $y := local:test-03-cache();

fn:deep-equal($x[1], $y[1]),
fn:deep-equal($x[2], [1,2]),
fn:deep-equal($x[2], $y[2]),
($x[3] is $y[3]),
fn:deep-equal($x[4], $y[4])