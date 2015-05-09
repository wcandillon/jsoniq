import module namespace xqdoc = "http://zorba.io/modules/xqdoc";
import module namespace req = "http://www.28msec.com/modules/http-request";
import module namespace res = "http://www.28msec.com/modules/http-response";
import module namespace json = "http://28.io/modules/xqdoc/json";

res:header("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
res:header("Access-Control-Allow-Headers", "Content-Type");
res:header("Access-Control-Allow-Origin", "*");
res:content-type("application/json");

if(req:method-post()) then
{|
let $modules := jn:parse-json(req:text-content())()
for $module in $modules
let $xqdoc := if($module.source) then xqdoc:xqdoc-content($module.source) else xqdoc:xqdoc($module.namespace)
let $xqdoc := json:convert($xqdoc)
return {
    $module.namespace: parse-json(serialize($xqdoc))
}
|}
else {}