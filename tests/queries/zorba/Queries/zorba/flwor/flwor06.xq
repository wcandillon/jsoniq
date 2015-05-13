jsoniq version "1.0";
{ result:

for $a in (1,2)
let $b := (1,2,3)
for $c in ($b)
let $d := ("a", "b", "c")
for $e in (1,2,3,4)
return { result: [$a, $d, $e] }

}