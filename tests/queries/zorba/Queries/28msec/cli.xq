xquery version "3.0";
module namespace cli = "http://portal.28.io/scripts/cli";

import module namespace sausalito = "http://portal.28.io/scripts/main";
import module namespace reflection ="http://zorba.io/modules/reflection";
import module namespace file = "http://expath.org/ns/file";
import module namespace util = "http://portal.28.io/scripts/sausalito-utils";
import module namespace fndoc = "http://portal.28.io/util/fn-doc-replace";
declare namespace err = "http://www.w3.org/2005/xqt-errors";
declare namespace options = "http://zorba.io/options/features";
declare namespace ann = "http://zorba.io/annotations";
declare namespace features = "http://zorba.io/features";
declare namespace errors = "http://28.io/errors";
declare option options:enable "features:hof";

declare variable $sausalito-home as xs:string external;
declare variable $params as xs:string external;
declare variable $newline := "&#10;";


declare %ann:sequential %ann:nondeterministic function cli:main() {
  variable $debug := false();

  variable $parameters;
  if ($debug) then $parameters := cli:create-xml($params);
  else {
  try{
  $parameters := cli:create-xml($params);
  } catch SAUS0005 {
   exit returning fn:concat($err:description, $newline); 
  } catch SAUS0011 {
   exit returning cli:usage(fndoc:doc('sausalito.xml'));
  } catch SAUS0012 {
   exit returning cli:action-usage($err:value);
  } catch SAUS0007{
   exit returning cli:item-usage($err:description, $err:value);
  } 
  }
  variable $action := fn:tokenize($params, ',')[1];
  variable $item := fn:tokenize($params, ',')[2];
  variable $function as xs:QName := QName('http://www.28msec.com/sausalito', fn:concat('sausalito:', $action, '-', $item));
  variable $l := $parameters/parameter[@key="location"]/text();
  variable $location := if (empty($l)) then 
    file:resolve-path(".")
  else 
    file:resolve-path($l);
  if (exists($parameters/parameter[@key="location"]))
  then replace value of node $parameters/parameter[@key="location"] with $location;
  else insert node <parameter key="location">{$location}</parameter> into $parameters;
  
  if ($debug)
  then cli:process-result(reflection:invoke-s($function, $parameters))
  else
   try { 
    cli:process-result(reflection:invoke-s($function, $parameters))
  }
  catch * {
  $err:description  }
};

declare function cli:usage($xml) {
fn:concat("28msec, Inc.
Sausalito Core SDK (ver. 1.2.12)

Usage:
   ./sausalito <action> <item> <options>

where action can be one of:
"
, 
  fn:string-join(for $action in $xml/sausalito/actions/action
    return concat("   ", $action/@name, " - ", $action/description, $newline)), 
   $newline
,
"For example:

"
,fn:string-join(
    for $example in $xml/sausalito/examples/example
      return fn:concat($example, $newline)
 ),"
Use ./sausalito <action> -h to get a list of available items.
"
 
 )
  
};

declare function cli:action-usage($action) {
 fn:concat("
Usage:
  ./sausalito ", $action/@name, " <item> -h to get a list of available options.

", $action/@name, " accepts the following items:

",
 fn:string-join(for $item in $action/item
 return
     fn:concat($item/@name, ', ', $item/@alias, util:wrap-indent(util:process_description($item, fn:false()), 6, fn:false())), $newline) 
 , "
")
};

declare %ann:nondeterministic function cli:list-templates() {
  fn:concat("
Available templates are: ", fn:string-join(file:list(fn:concat($sausalito-home, '/templates/projects')), ', '), '
')

};

declare %ann:nondeterministic function cli:item-usage($desc, $p) {

let $action := $p[1]
let $item := $p[2]
return
  fn:concat($desc, $newline, $newline, 
  "Usage:", $newline,
  "  ./sausalito ", $action/@name, " ", $item/@name, " <options>", $newline, $newline,
  "Available options are:", $newline,
 fn:string-join(for $option in $item/options/option
 let $len := fn:string-length($option/data(@name))
   return fn:concat("  -", $option/@name, " ", fn:substring($util:SPACES, 1, 5 -$len),
                      $option/description, $newline), ""),
 if ($action/@name="create") then if ($item/@name="template") then cli:list-templates() else () else ())

};

declare %ann:sequential %ann:nondeterministic function cli:create-xml($string) as element(parameters) {
variable $tokenized := fn:tokenize($string, ','); 
variable $action := $tokenized[1];
variable $item := $tokenized[2];
variable $sausalito-xml := fndoc:doc('sausalito.xml');
variable $action-conf := $sausalito-xml/sausalito/actions/action[@name=$action];
if (empty($action-conf)) then errors:error(xs:QName("SAUS0011"), "No action provided"); else ();
variable $conf := $action-conf/item[@name=$item or @alias=$item];
if (empty($conf)) then errors:error(xs:QName("SAUS0012"), "No item provided", $action-conf); else();
variable $params := fn:subsequence($tokenized, 3, fn:count($tokenized)-3);
variable $mode;
variable $currentoption;
variable $currentitem;
variable $givenvars := for $item in $params where fn:starts-with($item, '-') return $conf/options/option[@name=fn:substring($item,2)]/@variable/string(.);
variable $xml := <parameters/>;
if (empty($conf)) then errors:error(xs:QName("SAUS0005"), 'command not found'); else ();

(: check if all parameters that require a value are passed with it and vice versa :)
$mode := "option";
while (not(empty($params))) {
$currentitem := subsequence($params,1,1);
   switch ($mode)
       case "option" return {
           $currentoption := $conf/options/option[@name=fn:substring($currentitem,2)]/@variable;
           if (empty($currentoption)) then errors:error(xs:QName('SAUS0007'), fn:concat('Unknown option ', $currentitem, '.'), ($action-conf, $conf)); else (); 
           if (fn:starts-with($currentitem, '-')) then {
               if ($conf/options/option[@name=fn:substring($currentitem,2) and @type='value']) then {
                   $mode := "value";
                   insert node <parameter key="{fn:lower-case($currentoption)}"/> as last into $xml;
               }   
               else {
		  insert node <parameter key="{fn:lower-case($currentoption)}">true</parameter> as last into $xml;
                }
           
           }   
           else 
              errors:error(xs:QName('SAUS0008'), fn:concat('Invalid argument: ', $currentitem)); 
       }
       case "value" return
           if (fn:starts-with($currentitem, '-')) then 
              errors:error(xs:QName('SAUS0007'), fn:concat('Missing value for option -', $conf/options/option[@variable=$currentoption]/@name), ($action-conf, $conf)); 
           else {
               $mode := 'option';
               replace value of node $xml/parameter[last()] with $currentitem;
           }
       default return errors:error();
  $params := fn:subsequence($params, 2);
}
(: check if all mandatory arguments are passed :)
for $option in $conf//option
where $option[@mandatory='true']
return {
 if ($option/@variable = $givenvars) then (); else fn:error (xs:QName('SAUS0007'), fn:concat ('The mandatory option -', $option/@name, ' (', fn:lower-case($option/@variable), ') is missing.'), ($action-conf, $conf));
 if ($option/@type = "value") then (); else (); 
}
insert node <parameter key="sausalito-home">{$sausalito-home}</parameter> as last into $xml;
$xml
};


declare function cli:process-result($result) {

  fn:string-join(
  for $message in $result//message
  return
    fn:concat($message/@prefix, $message/text(), $newline))
};

