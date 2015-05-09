xquery version "3.0";
module namespace data-views = "http://portal.28.io/views/data-views";

import module namespace forms = "http://portal.28.io/util/forms";
import module namespace config = "http://portal.28.io/util/config";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare variable $data-views:xs-namespace := "{http://www.w3.org/2001/XMLSchema}";

declare function data-views:type-string($collection as object())
{
  if (fn:empty($collection("node-type")))
  then "untyped"
  else if ($collection("node-type") = "element(...)*")
  then "element(" || $collection("node-loc") || ")*"
  else if ($collection("node-type") = "schema-element(...)*")
  then "schema-element(" || $collection("node-loc") || ")*"
  else $collection("node-type")
};

declare  function data-views:atomic-types() as xs:string*
{
  ("string", "untypedAtomic", "anyURI", "ENTITY", "ID", "NMTOKEN", "language", "NCName",
  "Name", "token", "normalizedString", "QName", "boolean", "base64Binary", "hexBinary", "byte", "short", "int", "long",
  "unsingedByte", "unsingedShort", "unsingedInt", "unsignedLong", "positiveInteger", "nonNegativeInteger", "negativeInteger", "nonPositiveInteger",
  "integer","decimal","float","double","date","time","dateTime","dayTimeDuration","yearMonthDuration","duration","gMonth","gYear","gYearMonth","gDay","gMonthDay")
};

declare function data-views:display-type($type as xs:string?) as xs:string?
{
  if (fn:starts-with($type, $data-views:xs-namespace))
  then ("xs:" || fn:substring-after($type, $data-views:xs-namespace))
  else $type 
};

declare function data-views:collection-list($project as schema-element(s:project), $collections as object()*) {  
  
    <div class="content">
      <h2>Collections of project "{ fn:data($project/@name) }"</h2>
      <div class="alert alert-info" style="display:none">
        <span>1 Item selected</span>&#160;
        <a href="#" class="btn btn-mini">Download</a>&#160;
        <a href="/data/show-upload-collection" class="btn btn-mini">Upload</a>&#160;
        <a href="#" class="btn btn-mini">Delete</a>
      </div>
      <form action="/data/delete-collections" method="POST">
        <fieldset>
        <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
        { if (fn:empty($collections))
          then
            <p>There are no collections defined yet.</p>
          else
            <table class="table table-striped" width="100%" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  
                  <th>Name</th>              
                  <th>Type</th>
                  <th></th>                  
                </tr>
              </thead>
              { 
                for $collection in $collections
                order by $collection("name-loc") ascending
                return
                  <tr>
 <!--               <td><input type="checkbox" name="collection" value="{ $collection("name-loc") }" /></td>
                    <td><a href="/browser/browse?project={fn:encode-for-uri($project/@name)}#{fn:encode-for-uri($collection("name-loc"))}%2Cnull%2Cnull%2CXML%2Ccollection%2C1">{ $collection("name-loc") }</a></td>                     -->
                    <td>{ $collection("name-loc") }</td>
                    <td>{ data-views:type-string($collection) }</td>
                    <td><a href="/data/show-change-collection?project={fn:encode-for-uri($project/@name)}&amp;collection={ fn:encode-for-uri($collection("name-loc")) }" class="btn btn-once">change</a></td>
                  </tr>
              }
            </table>
         }                
        <div id="buttons">
          <a class="btn btn-primary btn-once" href="/data/show-create-collection?project={fn:encode-for-uri($project/@name)}">Create new</a>&#160;       
        </div>  
         { (: NOT-IN-V1
          {
            if (fn:empty($collections))
            then ()
            else <button type="submit" class="btn">Delete</button>
          }
          :) () }
        </fieldset>
      </form>
    </div>
};

declare function data-views:index-list($project as schema-element(s:project), $indexes as object()*) {
   <div class="content">
      <h2>Indexes of project "{ fn:data($project/@name) }"</h2>      
      <form action="/data/delete-indexes" method="POST">
        <fieldset>
         <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
      { if (fn:empty($indexes))
        then <p>There are no indexes declared yet.</p>
        else
      <table class="table table-striped" width="100%" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
           <th>-</th>
           <th>Name</th>
           <th>Domain Expr.</th>
           <th>Key-Expression(s)</th>
           <th>Key-Type(s)</th> 
               
          </tr>
        </thead>
        {
          for $index in $indexes
          return
            <tr>              
              <td><input type="checkbox" name="index" value="{ $index("name-loc") }"/></td>
              <td>{ $index("name-loc") }</td>
              <td>{ $index("domain-expr")}</td>
              <td>
              { 
                if (exists($index("key-exprs")))
                then
                 for $e in jn:members($index("key-exprs")) return ($e,<br/>)
                else "Undefined" 
              }
              </td>
              <td>
              {
                if (exists($index("key-types")))
                then for $e in jn:members($index("key-types")) return (data-views:display-type($e),<br/>)
                else "Undefined" 
              }
              </td>  
                       
            </tr>
        }
      </table>
      }  
      <div id="buttons">
        <a class="btn btn-primary btn-once" href="/data/show-create-index?project={fn:encode-for-uri($project/@name)}">Create New</a>
        &#160;
        {
          if (fn:empty($indexes))
          then ()
          else <button type="submit" class="btn">Delete</button>
        }
      </div>     
      </fieldset>
      </form>
    </div>
};

declare function data-views:schema-list($project as schema-element(s:project), $schemas as schema-element(s:schema)*) {
   <div class="content">
      <h2>Schemas of project "My Example"</h2>
      <div class="alert alert-info">
        <span>1 Item selected</span>&#160;
        <a href="#" class="btn btn-mini">Delete</a>
      </div>
      <table class="table table-striped" width="100%" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
           <th>-</th>
           <th>URI</th>
           <th>Path</th>
           <th>Default-Prefix</th>
          </tr>
        </thead>
        { 
          for $schema in $schemas
          return
             <tr>
               <td><input type="checkbox" checked="checked"/></td>
               <td>{ fn:data($schema/s:uri) }</td>
               <td>{ fn:data($schema/s:file-path) }</td>
               <td>{ fn:data($schema/s:default-prefix) }</td>
             </tr>
        } 
      </table>
      <div id="buttons">
        <a class="btn btn-primary" href="/data/show-create-schema">Upload New</a>&#160;
        <a class="btn btn-once" href="/schemagen/show-generate-schema">Generate Schema</a>
      </div>
    </div>
};

declare function data-views:change-collection($project as schema-element(s:project), $collection as object()) {
  let $types := ( "-------JSON-------","object()*", "array()*", "-------XML--------" , "node()*", "element()*","element(...)*","schema-element(...)*"  )
  return
   <div class="content">
      <h2>Change collection</h2>     
      { forms:layout(
      <form class="form-horizontal" method="POST" action="/data/change-collection">
       <fieldset>
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <input type="hidden" name="collection" value="{ $collection("name-loc") }" />
        <x:row label="Name"><div style="padding-top:5px">{ $collection("name-loc") }</div></x:row>
        <x:row label="Node Type">
          <select type="text" id="cc-nodetype" name="nodetype" size="8" onChange="
            if ($('#cc-nodetype').val().indexOf('--') >= 0) $('#cc-submit').attr('disabled', 'disabled'); else $('#cc-submit').removeAttr('disabled'); 
            if ($('#cc-nodetype').val().indexOf('element(...')>=0) $('.cc-element').show(); 
            else {{ $('.cc-element').hide();$('#cc-element-input').val('');$('#cc-namespace-input').val(''); }};            
          " value="{ $collection("node-type") }">
          {
            for $type in $types
            return <option value="{$type}">
              { if ($type = $collection("node-type")) then attribute selected { "selected" } else () } 
              { $type } 
            </option>
          }
          </select>        
        </x:row>
        <div id="cc-element-div" class="cc-element" style="display:none">
          <x:row label="Element Local Name"><input id="cc-element-input" type="text" name="localname" value="{ $collection("node-loc") }"/></x:row>
        </div>
        <div id="cc-namespace-div" class="cc-element" style="display:none">               
          <x:row label="Element Namespace"><input id="cc-namespace-input" type="text" name="namespace" size="30" value="{ $collection("node-ns") }"/></x:row>
        </div>  
        <script>$(function() {{ $('#cc-nodetype').trigger("change"); }});</script>        
        <div class="form-actions">
          <button id="cc-submit" class="btn btn-primary btn-once" type="submit">Change</button>
        </div>   
        </fieldset>             
      </form> 
      ) }     
  </div>
};

declare function data-views:create-collection($project as schema-element(s:project)) {
  let $types := ( "-------JSON-------","object()*", "array()*", "-------XML--------" , "node()*", "element()*","element(...)*","schema-element(...)*"  )
  return
   <div class="content">
      <h2>Create collection</h2>     
      { forms:layout(
      <form class="form-horizontal" method="POST" action="/data/create-collection">
       <fieldset>
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />        
        <x:row label="Name"><input type="text" name="collection" /></x:row>
        <x:row label="Node Type">
          <select type="text" id="cc-nodetype" name="nodetype" size="8" onChange="
            if ($('#cc-nodetype').val().indexOf('--') >= 0) $('#cc-submit').attr('disabled', 'disabled'); else $('#cc-submit').removeAttr('disabled'); 
            if ($('#cc-nodetype').val().indexOf('element(...')>=0) $('.cc-element').show(); 
            else {{ $('.cc-element').hide();$('#cc-element-input').val('');$('#cc-namespace-input').val(''); }};            
          ">
          {
            for $type in $types
            return <option value="{$type}">           
              { $type } 
            </option>
          }
          </select>        
        </x:row>
        <div id="cc-element-div" class="cc-element" style="display:none">
          <x:row label="Element Local Name"><input id="cc-element-input" type="text" name="localname"/></x:row>
        </div>
        <div id="cc-namespace-div" class="cc-element" style="display:none">               
          <x:row label="Element Namespace"><input id="cc-namespace-input" type="text" name="namespace" size="30"/></x:row>
        </div>  
        <script>$(function() {{ $('#cc-nodetype').trigger("change"); }});</script>        
        <div class="form-actions">
          <button id="cc-submit" class="btn btn-primary btn-once" type="submit">Create</button>
        </div>   
        </fieldset>             
      </form> 
      ) }     
  </div>
};

declare function data-views:create-index($project as schema-element(s:project), $collections as object()*) {
   <div class="content">
      <h2>Create new index</h2>            
      { 
        let $collection-options :=
            for $collection in $collections
            let $collection-name := $collection("name-loc")
            where not(fn:starts-with($collection-name, "_28.")) and exists($collection("node-type"))
            order by $collection-name ascending
            return <option value="{$collection-name}">db:collection("{ $collection-name }")</option>
         return
           if (empty($collection-options))
           then <p>You need to have at least one typed collection to use this feature.</p>
           else
        forms:layout(
      <form class="form-horizontal" action="/data/create-index" method="POST">
        <fieldset>
        <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
        <x:row label="Name"><input type="text" name="name" size="30" /></x:row>
        <x:row label="Expression">
          <select size="1" name="domain-expr">
          {
            $collection-options
          }
          </select>
          <input type="text" name="domain-expr-append" size="10"/> 
        </x:row>
        { (: <x:row label="Collection">
          <select size="1" name="collection">
          {
            for $collection in $collections
            let $collection-name := $collection("name-loc")
            order by $collection-name ascending
            return <option value="{$collection-name}">{ $collection-name }</option>
          }
          </select>
        </x:row> :) () }
        { for $i in 1 to 10
          let $i-str := xs:string($i)
          return
            <div id="exprrow{$i-str}" class="autoshow xnodisplay">     
              <x:row label="Key Expression {$i-str}">
                <input type="text" class="checkempty" name="expression{$i-str}" size="30" placeholder="@id"/> as 
                <select name="type{$i-str}">
                  { for $t in data-views:atomic-types()
                    return <option value="{'{http://www.w3.org/2001/XMLSchema}' || $t}">xs:{ $t }</option>
                  }
                </select>
                <select style="width:50px" name="type{$i-str}append">
                  <option></option>
                  <option>?</option>
                </select>
              </x:row>
            </div>
        }
        <x:row label=""><button type="button" onClick="addrow();" class="btn">Add Index Dimension</button></x:row>
        <x:row label="Maintenance"><select size="1" name="maintain"><option>automatic</option><option>manual</option></select></x:row>
        <x:row label="Uniqueness"><select size="1" name="uniqueness"><option>non unique</option><option>unique</option></select></x:row>
        { (:
        <x:row label="Index Type"><select size="1" name="index-type"><option>value-range</option><option>value-equality</option></select></x:row>
        :) () }
        <div class="form-actions">
           <button class="btn btn-primary" type="submit">Create</button>
        </div>    
        </fieldset>    
      </form>   
      ) }
      <script><![CDATA[
        $(function() {
          $(".autoshow").each(function(i,e) {
            if ($(".checkempty", e).val()!="") $(e).removeClass("xnodisplay");
          });
          $("#exprrow1").removeClass("xnodisplay");
        });
        function addrow() {
          $(".xnodisplay").first().removeClass("xnodisplay");
        };
      ]]></script> 
   </div>
};

declare function data-views:create-schema($project as schema-element(s:project)) {
  <div class="content">
      <h2>Create new schema</h2>
      <div id="success" style="display:none" class="successbox">
        <p>Successfully created schema.</p>
        <div id="buttons">
          <a class="btn" href="/data/schemas">Back to schemas</a>&#160;
          <!--
          <a class="btn" href="/help/overview">Back to Getting Started</a>
          -->
        </div>
      </div>
      { forms:layout(
      <form class="form-horizontal">
        <legend>Schema Upload</legend>
        <fieldset>
          <x:row label="Schema-File"><input type="file" name="file" size="30" /></x:row>
          <x:row label="Default Prefix"><input type="text" name="prefix" size="30" /></x:row>
        </fieldset>
        <div class="form-actions">
          <button class="btn btn-primary" type="button" onClick="document.getElementById('success').style.display='block';">Upload</button>
        </div>
      </form> 
      ) }
      
    </div>
};

declare function data-views:upload-collection($project as schema-element(s:project)) {
  <div class="content">
      <h2>Upload file</h2>
      <div id="success" style="display:none" class="successbox">
        <p>Successfully uploaded data</p>
        <div id="buttons">
          <a class="btn" href="/data/collections">Back to Collections</a>&#160;
          <!--
          <a class="btn" href="/help/overview">Back to Getting Started</a>
          -->
        </div>
      </div>
      { forms:layout(
      <form class="form-horizontal">
        <fieldset>
        <x:row label="Collection"><select name="collection"><option>Collection 1</option><option>Collection 2</option></select></x:row>
        <x:row label="Type"><select name="type" size="1" ><option>Auto-Detect</option><option>XML</option><option>HTML</option><option>JSON</option><option>CSV</option><option>Text</option></select></x:row>
        <x:row label="Options"><span>Options for selected data type</span></x:row>
        </fieldset>
        <div class="alert alert-info">Enter a URL pointing to the data or upload a local file:</div>
        <fieldset>
        <x:row label="URL"><div class="input-append"><input type="text" name="url" size="30" /><button class="btn btn-primary" type="button" onClick="document.getElementById('success').style.display='block';">Get</button></div></x:row>
        <x:row label="File"><input type="file" class="input-file" name="file" size="30" /><button class="btn btn-primary" type="button" onClick="document.getElementById('success').style.display='block';">Upload</button></x:row>
        </fieldset>
        <div class="form-actions">

        </div>                
      </form> 
      ) }
  </div>
};

declare function data-views:export($api-token as xs:string, $project as schema-element(s:project)) {
  <div class="content">
    <h2>Import / Export</h2>
    <table>
      <tr>
        <th>Export</th>
        <th>Import</th>
      </tr>
      <tr style="vertical-align:top">
        <td style="padding-right:50px;padding-bottom:40px;">
          <p>Export metadata to project file /metadata.ddl</p>
          <form action="/data/export-project" name="export-project">
            <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
            <button class="btn btn-once" type="submit">Export to Project</button>
          </form>          
        </td>
        <td>
          <p>Import metadata from project file /metadata.ddl</p>
          <form action="/data/import-project" name="import-project">
            <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
            <button class="btn btn-once" type="submit">Import from Project</button>
          </form>
        </td>
      </tr>
      <tr style="vertical-align:top">
        <td style="padding-right:50px;padding-bottom:40px;">
          <p>Export metadata to your local filesystem.</p>
          <a class="btn" href="{ config:project-url($project/@name) || '/sausalito/export' || '?token=' || fn:encode-for-uri($api-token)  }">Export File</a>  
        </td>
        <td>
          <p>Import metadata from your local filesystem.</p>
          <form action="/data/import-file" name="import-file" method="post" enctype="multipart/form-data">
            <input type="hidden" name="project" value="{ fn:data($project/@name) }" />
            <input type="file" name="file" />
            <button class="btn btn-primary" type="submit">Import File</button>
          </form>        
        </td>      
      </tr>
    </table>          
  </div>
};

