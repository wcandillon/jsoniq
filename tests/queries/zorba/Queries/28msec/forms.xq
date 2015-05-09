xquery version "3.0";
module namespace forms = "http://portal.28.io/util/forms";

import module namespace errors = "http://portal.28.io/util/errors";

import module namespace req = "http://www.28msec.com/modules/http/request";

declare namespace html = "http://www.w3.org/1999/xhtml";
declare namespace x = "http://portal.28.io/util/forms";

(:~
 : Helps formatting forms 
 : @param inputform  
 : @return formatted form
 :)
declare function forms:layout($inputform) {
  copy $form := $inputform
  modify (
    for $elem in $form/descendant::x:row
    let $for := $elem/element()[1]/@name
    let $id := if ($elem/@id) then attribute { "id" } { $elem/@id/string() } else ()
    let $style := if ($elem/@style) then attribute { "style" } { $elem/@style/string() } else ()
    return 
      replace node $elem with
        <div class="control-group">
          { $id, $style }
          <label class="control-label" for="{ fn:data($for) }">
          {
            if ($elem/@help)
            then <a data-original-title="{fn:data($elem/@label)}" data-content="{fn:data($elem/@help)}" data-placement="right" rel="popover" onclick="return false;" href="#">{
              $elem/@*[starts-with(local-name(.),"data-")],
              fn:data($elem/@label)}</a>
            else fn:data($elem/@label) 
          }
          </label>          
          <div class="controls">
            { $elem/node() }            
          </div>
        </div> 
  )
  return $form    
};

(:~
 : Returns a copy of the input form where all input fields a populated with the values of the current request
 : 
 : @param inputform some HTML containing a form  
 : @return the same HTML with populated input fields
 :)
declare function forms:populated-copy($inputform) {
  copy $form := $inputform[1]
  modify (
    for $input in $form/descendant::input[@name]
    let $value := req:parameter-values($input/@name)
    return
      if ($input/@type = ("text","password"))
      then
        if ($input/@value) 
        then replace value of node $input/@value with $value
        else insert node attribute value { $value } into $input
      else if ($input/@type = ("radio","checkbox"))
      then
        if ($input/@value = $value)
        then 
          if (not($input/@checked))
          then insert node attribute checked { "checked" } into $input
          else ()
        else delete nodes $input/@checked
      else (),
    for $select in $form/descendant::select[@name]
    let $value := req:parameter-values($select/@name)
    let $option := $select/option[@value = $value]
    where $option    
    return 
      if (not($option/@selected))
      then insert node attribute selected { "selected" } into $option
      else ()
  )
  return $form  
};

(:~
 : Adds an error message to an HTML form
 : 
 : @param form HTML data containing the form
 : @param fieldname name of parameter where the error message should be added
 : @param errormessage text or html with the error message  
 : @return the form with additional error message
 :)
declare %an:sequential function forms:add-error($form, $fieldname as xs:string?, $errormessage) {
  forms:add-error($form, (), $fieldname, $errormessage)
};

declare %an:sequential function forms:add-error($input, $formname as xs:string?, $fieldname as xs:string?, $errormessage) {
  let $form :=
    if ($formname)
    then $input/descendant::form[@name = $formname]
    else if (exists($input/descendant::form))
    then $input/descendant::form
    else $input
  let $inputfield :=
    if ($fieldname) 
    then $form/descendant::input[@name = $fieldname][1]
    else ($form/descendant::input[@name and not(@type="hidden")])[1]
  let $control-group := 
    if ($inputfield)
    then $inputfield/ancestor::element()[@class="control-group"][1]
    else ()
  return 
  {
    if (fn:contains($form/@class,"open-anim"))
    then replace value of node $form/@class with fn:replace($form/@class,"open-anim","error-anim");
    else ();
     
    if ($inputfield and $control-group)
    then
      let $control-group := $inputfield/ancestor::element()[@class="control-group"][1]
      return (
        replace value of node $control-group/@class with fn:concat($control-group/@class," error"),
        if ($inputfield/parent::element()/@class = "input-append")
        then insert node <span class="help-inline">{ $errormessage }</span> after $inputfield/parent::element()
        else insert node <span class="help-inline">{ $errormessage }</span> after $inputfield
      );  
    else
      let $insert-pos := 
        if ($inputfield)
        then $inputfield/ancestor::fieldset
        else ($form/descendant-or-self::form)[1]
      return
        if ($insert-pos)
        then insert node <div class="alert alert-error">{ $errormessage }</div> as first into $insert-pos;
        else
          let $page-head := $form/descendant-or-self::div[@class="content"]
          return
            if ($page-head) 
            then insert node <div class="alert alert-error">{ $errormessage }</div> as first into $page-head;
            else insert node <div class="alert alert-error">{ $errormessage }</div> as first into $form;
  }
  
  
  $input
};

(:~
 : Tests if a list of parameters is set in the current request. Throws an error if a parameter is missing.
 : 
 : @param fields a list of parameter names that must be set
 : @return empty-sequence if all parameters are set or an forms:required error if not.
 :)
declare function forms:required($fields as xs:string*) as empty-sequence() {
  for $field in $fields
  let $param := req:parameter-values($field)
  return
   if (fn:empty($param) or $param="")
   then errors:error($errors:parameter-required, "This field is required", $field)
   else ()
};

declare function forms:integer($field as xs:string) as empty-sequence() {
  let $param := req:parameter-values($field)
  return
   if (exists($param) and not($param castable as xs:integer))
   then errors:error($errors:parameter-required, "An integer value is required.", $field)
   else ()
};
