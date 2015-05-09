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

module namespace map = "http://snelson.org.uk/functions/map";
declare default function namespace "http://snelson.org.uk/functions/map";
import module namespace rbtree = "http://snelson.org.uk/functions/rbtree" at "rbtree.xq";

declare function entry($key as item(), $value as item()*)
  as function() as item()+
{
  function() as item()+ { $key, $value }
};

declare %private function key($pair as function() as item()+) as item()
{
  fn:head($pair())
};

declare %private function value($pair as function() as item()+) as item()*
{
  fn:tail($pair())
};

declare %private function lt($a as item(), $b as item()) as xs:boolean
{
  key($a) lt key($b)
};

declare function create() as function() as item()*
{
  rbtree:create()
};

declare function put(
  $map as function() as item()*,
  $key as item(),
  $value as item()*
) as (function() as item()+)+
{
  rbtree:insert(lt#2, $map, entry($key, $value))
};

declare function put(
  $map as function() as item()*,
  $pair as function() as item()+
) as (function() as item()+)+
{
  rbtree:insert(lt#2, $map, $pair)
};

declare function get($map as function() as item()*, $key as item())
  as item()*
{
  rbtree:get(lt#2, $map, entry($key, ())) ! value(.)
};

declare function contains($map as function() as item()*, $key as item())
  as xs:boolean
{
  rbtree:contains(lt#2, $map, entry($key, ()))
};

declare function delete($map as function() as item()*, $key as item())
  as function() as item()*
{
  rbtree:delete(lt#2, $map, entry($key, ()))
};

declare function fold(
  $f as function(item()*, item(), item()*) as item()*,
  $z as item()*,
  $map as function() as item()*
) as item()*
{
  rbtree:fold(
    function($result, $pair) {
      $f($result, key($pair), value($pair))
    },
    $z, $map)
};

declare function count($map as item()) as xs:integer
{
  rbtree:fold(function($result, $pair) { $result + 1 },0, $map)
};

declare function empty($map as function() as item()*) as xs:boolean
{
  rbtree:empty($map)
};
