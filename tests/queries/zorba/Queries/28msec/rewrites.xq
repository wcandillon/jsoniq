xquery version "3.0";
module namespace rewrite = "http://portal.28.io/projects/rewrites";
import schema default element namespace "http://28.io/schemas/sausalito"; 
 
import module namespace file = "http://expath.org/ns/file";
import module namespace fndoc = "http://portal.28.io/util/fn-doc-replace";
declare namespace ann = "http://zorba.io/annotations";
declare namespace err = "http://www.w3.org/2005/xqt-errors";

declare %an:nondeterministic function rewrite:main($htaccess, $doc) {

  variable $d := rewrite:validate-doc($doc);
  variable $rules := rewrite:rewrite-rules($d);
  variable $htaccess-content := file:read-text($htaccess);

  (: insert the rule section into the existing .htaccess template 
     and return it :)
  concat(
    fn:substring-before($htaccess-content, "# RULES MARKER BEGIN"),
    $rules,
    fn:substring-after($htaccess-content, "# RULES MARKER END")
  )
};

declare %an:nondeterministic function rewrite:main-nosausa($htaccess, $doc) {

  variable $rules := rewrite:rewrite-rules($doc);
  variable $htaccess-content := file:read-text($htaccess);

  (: insert the rule section into the existing .htaccess template 
     and return it :)
  concat(
    fn:substring-before($htaccess-content, "# RULES MARKER BEGIN"),
    $rules,
    fn:substring-after($htaccess-content, "# RULES MARKER END")
  )
};


(:~
 : validate if the given document is a valid sausalito.xml configuration 
 : file
 :)
declare %an:nondeterministic function rewrite:validate-doc($doc)
{
  try { 
    validate { fndoc:doc($doc) }
  } catch XQDY0027 {
    fn:error($err:code, 
      concat("Unfortunately, the sausalito.xml configuration file of your project ",
             "is not valid. It doesn't conform to the schema for the following ",
             "reason: ", $err:description))
  } catch * {
    fn:error($err:code, 
      concat("Unfortunately, the sausalito.xml configuration file is broken. ",
             "Reason: ", $err:description))
  }
};

(:~
 : check if the given regular expression is (1) syntactically correct and
 : (2) does not contain any whitespace (because they are delimiters used
 : by mod_rewrite
 :)


declare function rewrite:validate-regexp($regexp as xs:string) as xs:string
{
  try 
  {
    fn:matches("sometext", $regexp); (: raises FORX0002 if the regexp is invalid :)
    not(fn:matches($regexp, ".*\n| |\t.*")); (: regexp must not contain any whitespace :)
  } 
  catch FORX0002 
  {
    fn:error(xs:QName("rewrite:regexp"),
      "The regular expression " || $regexp || " used in either the pattern or the " || 
      "substitution of a rewrite rule is invalid.");
  }
  $regexp
};

(:~
 : generate the RewriteRule section for the .htaccess file
 : look at all rewrite elements in sausalito.xml and also the start_page
 : element for backwards compatibility.
 :)
declare function rewrite:rewrite-rules($doc)
{
  string-join(
  (
    if ($doc//start_page)
    then "&#xA;RewriteRule ^$|^/$ %{ENV:FORWARD_PROTOCOL}://%{HTTP_HOST}" || $doc//start_page/text() || " [R=302,L]"
    else (),
    
    for $rewrite at $y in $doc//rewrites/rewrite
    return 
      let $rule := $rewrite/rule
      let $pattern := rewrite:validate-regexp($rule/pattern)
      let $substitution := rewrite:validate-regexp($rule/substitution)
      let $user-flags := $rule/flags/flag/text()
      let $flags := $user-flags
      return
        "RewriteRule " || 
        $pattern || " " || (: pattern :) 
        $substitution || " " || (: substitution :) 
        "[" || fn:string-join($flags, ",") || "]" (: flags :)
    )
    ,"&#xA;"
  )
};
