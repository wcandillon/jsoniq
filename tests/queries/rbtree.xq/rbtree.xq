xquery version "3.0";

(:
 : Copyright (c) 2010-2014 John Snelson
 :
 : Licensed under the Apache License, Version 2.0 (the "License");
 : you may not use this file except in compliance with the License.
 : You may obtain a copy of the License at
 :
 :     http://www.apache.org/licenses/LICENSE-2.0
 :
 : Unless required by applicable law or agreed to in writing, software
 : distributed under the License is distributed on an "AS IS" BASIS,
 : WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 : See the License for the specific language governing permissions and
 : limitations under the License.
 :)

module namespace rbtree = "http://snelson.org.uk/functions/rbtree";
declare default function namespace "http://snelson.org.uk/functions/rbtree";

declare function create() as function() as item()*
{
  function() as empty-sequence() { () }
};

declare %private function create(
  $x as item(),
  $a as function() as item()*,
  $b as function() as item()*,
  $isred as xs:boolean
) as function() as item()+
{
  function() as item()+ { $x, $a, $b, $isred }
};

declare %private function make-black(
  $tree as function() as item()*
) as function() as item()*
{
  let $res := $tree()
  return if(fn:empty($res) or fn:not($res[4])) then $tree
  else create($res[1], $res[2], $res[3], fn:false())
};

declare %private function make-red(
  $tree as function() as item()*
) as function() as item()*
{
  let $res := $tree()
  return create($res[1], $res[2], $res[3], fn:true())
};

declare function empty($tree as function() as item()*) as xs:boolean
{
  fn:empty($tree())
};

declare %private function value($tree as function() as item()*) as item()
{
  $tree()[1]
};

declare %private function left($tree as function() as item()*) as function() as item()*
{
  $tree()[2]
};

declare %private function right($tree as function() as item()*) as function() as item()*
{
  $tree()[3]
};

declare %private function isred($tree as function() as item()*) as xs:boolean
{
  (: works for leaves and inner nodes :)
  $tree()[4] = fn:true()
};

declare function contains(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as xs:boolean
{
  fn:exists(get($lessthan, $tree, $x))
};

declare function get(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as item()?
{
  find_gte($lessthan, $tree, $x)[fn:not($lessthan($x, .))]
};

declare function find_gte(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as item()?
{
  if(empty($tree)) then () else

  let $y := value($tree)
  return

  if($lessthan($y, $x)) then find_gte($lessthan, right($tree), $x)
  else fn:head((find_gte($lessthan, left($tree), $x), $y))
};

declare function fold(
  $f as function(item()*, item()) as item()*,
  $z as item()*,
  $tree as function() as item()*
) as item()*
{
  if(empty($tree)) then $z else

  fold($f,
    $f(fold($f, $z, left($tree)), value($tree)),
    right($tree))
};

declare function insert(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as function() as item()+
{
  let $result := insert-helper($lessthan, $tree, $x)
  return make-black(fn:head($result))
};

declare %private function insert-helper(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as item()+
{
  if(empty($tree)) then (
    create($x, create(), create(), fn:true())
  ) else (
    let $y := value($tree)
    let $l := left($tree)
    let $r := right($tree)
    let $isred := isred($tree)
    return
    if($lessthan($x, $y)) then (
      let $l2 := insert-helper($lessthan, $l, $x)
      return (
        if(fn:not($isred) and isred($l2)) then (
          balance-left(fn:false(), $l2, $y, $r)
        ) else (
          create($y, $l2, $r, $isred)
        )
      )
    ) else if($lessthan($y, $x)) then (
      let $r2 := insert-helper($lessthan, $r, $x)
      return (
        if(fn:not($isred) and isred($r2)) then (
          balance-right(fn:false(), $l, $y, $r2)
        ) else (
          create($y, $l, $r2, $isred)
        )
      )
    ) else (
      create($x, $l, $r, $isred)
    )
  )
};

declare %public function delete(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) as function() as item()* {
  let $tree2 := fn:head(delete-helper($lessthan, $tree, $x))
  return
    if(fn:empty($tree2)) then $tree
    else make-black($tree2)
};

declare %private function delete-helper(
  $lessthan as function(item(), item()) as xs:boolean,
  $tree as function() as item()*,
  $x as item()
) {
  if(empty($tree)) then ()
  else (
    let $red := isred($tree),
        $l   := left($tree),
        $y   := value($tree),
        $r   := right($tree)
    return if($lessthan($x, $y)) then (
      let $res := delete-helper($lessthan, $l, $x),
          $l2  := $res[1],
          $bb  := $res[2]
      return if(fn:empty($res)) then ()
      else if($bb) then bubble-left($red, $l2, $y, $r)
      else create($y, $l2, $r, $red)
    ) else if($lessthan($y, $x)) then (
      let $res := delete-helper($lessthan, $r, $x),
          $r2  := $res[1],
          $bb  := $res[2]
      return if(fn:empty($res)) then ()
      else if($bb) then bubble-right($red, $l, $y, $r2)
      else create($y, $l, $r2, $red)
    ) else (
      (: delete here :)
      if(empty($l)) then (
        if(empty($r)) then (
          create(),
          fn:not($red)
        ) else (
          make-black($r),
          fn:false()
        )
      ) else (
        if(empty($r)) then (
          make-black($l),
          fn:false()
        ) else (
          let $split := split-leftmost(isred($r), left($r), value($r), right($r)),
              $val   := $split[1],
              $r2    := $split[2],
              $bb    := $split[3]
          return if($bb) then bubble-right($red, $l, $val, $r2)
          else create($val, $l, $r2, $red)
        )
      )
    )
  )
};

declare %private function split-leftmost(
  $red as xs:boolean,
  $l as function() as item()*,
  $x as item(),
  $r as function() as item()*
) as item()* {
  if(empty($l)) then (
    if(empty($r)) then (
      $x,
      create(),
      fn:not($red)
    ) else (
      $x,
      make-black($r),
      fn:false()
    )
  ) else (
    let $res := split-leftmost(isred($l), left($l), value($l), right($l)),
        $y   := $res[1],
        $l2  := $res[2],
        $bb  := $res[3]
    return if($bb) then (
      $y,
      bubble-left($red, $l2, $x, $r)
    ) else (
      $y,
      create($x, $l2, $r, $red),
      fn:false()
    )
  )
};

declare %private function bubble-left(
  $isred as xs:boolean,
  $bbl as function() as item()*,
  $x as item(),
  $r as function() as item()*
) as item()* {
  if(isred($r)) then (
    let $rl := left($r)
    return create(
      value($rl),
      create($x, $bbl, left($rl), fn:false()),
      balance-right(fn:false(), right($rl), value($r), make-red(right($r))),
      fn:false()
    ),
    fn:false()
  ) else (
    let $isblack := fn:not($isred),
        $tree    := balance-right($isblack, $bbl, $x, make-red($r))
    return ($tree, $isblack and isred(right($tree)))
  )
};

declare %private function bubble-right(
  $isred as xs:boolean,
  $l as function() as item()*,
  $x as item(),
  $bbr as function() as item()*
) as item()* {
  if(isred($l)) then (
    let $lr := right($l)
    return create(
      value($lr),
      balance-left(fn:false(), make-red(left($l)), value($l), left($lr)),
      create($x, right($lr), $bbr, fn:false()),
      fn:false()
    ),
    fn:false()
  ) else (
    let $isblack := fn:not($isred),
        $tree    := balance-left($isblack, make-red($l), $x, $bbr)
    return ($tree, $isblack and isred(left($tree)))
  )
};

declare %private function balance-left(
  $bb as xs:boolean,
  $l as function() as item()*,
  $x as item(),
  $r as function() as item()*
) as item()* {
  if(isred($l)) then (
    if(isred(left($l))) then (
      create(
        value($l),
        make-black(left($l)),
        create($x, right($l), $r, fn:false()),
        fn:not($bb)
      )
    ) else if(isred(right($l))) then (
      let $lr := right($l)
      return create(
        value($lr),
        create(value($l), left($l), left($lr), fn:false()),
        create($x, right($lr), $r, fn:false()),
        fn:not($bb)
      )
    ) else (
      create($x, $l, $r, fn:false())
    )
  ) else (
    create($x, $l, $r, fn:false())
  )
};

declare %private function balance-right(
  $bb as xs:boolean,
  $l as function() as item()*,
  $x as item(),
  $r as function() as item()*
) as item()* {
  if(isred($r)) then (
    if(isred(right($r))) then (
      create(
        value($r),
        create($x, $l, left($r), fn:false()),
        make-black(right($r)),
        fn:not($bb)
      )
    ) else if(isred(left($r))) then (
      let $rl := left($r)
      return create(
        value($rl),
        create($x, $l, left($rl), fn:false()),
        create(value($r), right($rl), right($r), fn:false()),
        fn:not($bb)
      )
    ) else (
      create($x, $l, $r, fn:false())
    )
  ) else (
    create($x, $l, $r, fn:false())
  )
};

declare %public function check-invariants($lt, $tree, $min, $max, $msg) {
  if(empty($tree)) then 0
  else (
    let $isred := isred($tree),
        $l     := left($tree),
        $k     := value($tree),
        $r     := right($tree)
    return (
      if(fn:not($lt($min, $k))) then (
        fn:error(xs:QName('rbtree:CHCK0001'), $msg)
      ) else if(fn:not($lt($k, $max))) then (
        fn:error(xs:QName('rbtree:CHCK0002'), $msg)
      ) else if($isred and (isred($l) or isred($r))) then (
        fn:error(xs:QName('rbtree:CHCK0003'), $msg)
      ) else (
        let $h1 := check-invariants($lt, $l, $min, $k, $msg),
            $h2 := check-invariants($lt, $r, $k, $max, $msg)
        return if($h1 ne $h2) then (
          fn:error(xs:QName('rbtree:CHCK0004'), $msg)
        ) else if($isred) then $h1 else $h1 + 1
      )
    )
  )
};

declare %public function to-xml($tree) {
  if(empty($tree)) then element L { }
  else element { if(isred($tree)) then 'R' else 'B' } {
    to-xml(left($tree)),
    element V { value($tree) },
    to-xml(right($tree))
  }
};
