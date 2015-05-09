xquery version "3.0";
module namespace project-views = "http://portal.28.io/views/project-views";

import module namespace forms = "http://portal.28.io/util/forms";
import module namespace config = "http://portal.28.io/util/config";

import module namespace packages = "http://portal.28.io/billing/project-packages";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare variable $project-views:keep-password := "____keep";

declare function project-views:parse-html($string as xs:string)
as item()*
{
    variable $temp := parse-xml("&lt;p>" || $string || "&lt;/p>");
    
    $temp/p/node()
};

declare function project-views:project-list($projects as schema-element(s:project)*) {
  <div class="content">
    <div class="pane-header">
      { if(exists($projects)) then <a class="btn btn-primary btn-large btn-once pull-right" href="/projects/show-create">Create New Project</a> else () }
      <h2>Project List</h2>
    </div>
    {
     if (empty($projects))
      then
      (
        <div class="hcenter">
        <p>There are no projects.</p>
        <a class="btn btn-primary btn-large btn-once" href="/projects/show-create">Create New Project</a>
        </div>
      )
      else
        <div class="pane-content">
          <ul class="nav nav-tabs nav-stacked project-list">
            {
              for $project in $projects
              let $name := $project/@name/string()
              let $package-name := packages:package-by-id($project/s:package)/s:name/data()
              let $db-type as xs:string := $project/s:database/s:db-type/string()
              order by $project/@name ascending 
              return <li>
                <a href="/databrowser/view?project={fn:encode-for-uri($name)}">
                <i class="icon-chevron-right pull-right" style="margin-top: 4px;"></i>
                {$name}
                <span class="label { switch($package-name ! lower-case(.)) case "free" return "label-success" case "shared" return "label-info" default return ""}" style="margin-left: 15px;">
                { fn:substring-before($package-name, " (") }
                </span>
                {
                  if ( $db-type = ( "user", "none", "28msec", "local", "mongolab" ) )
                  then
                    let $class as xs:string := "label" ||
                       (  switch( $db-type )
                          case "user" return " label-success"
                          case "local" return " label-warning"
                          default return "" )
                    let $label as xs:string := 
                       switch ($db-type)
                       case "user" return "BYOMDB"
                       case "none" return "No DB"
                       case "local" return "Local DB"
                       case "mongolab" return "MongoLab"
                       case "28msec" return "Autoprovisioned DB"
                       default return "custom"
                    return
                      <span class="{ $class }" style="margin-left: 15px;">
                        { $label }
                      </span>
                  else ()
                }
                </a>
              </li>
            }
          </ul>
        </div>
  }
  </div>
};

declare function project-views:create-project(
    $account as schema-element(s:account), 
    $packages as schema-element(s:package)*, 
    $test-results as element()?, 
    $recurly-billing-info as element()?, 
    $signature as xs:string?)
as element(div)
{
  <div class="content">
    <script src="/portaljs/create-project.js" />
    <script src="/portaljs/byomongodb.js" />
    <script src="/mongojs/URI.js" />
    <script src="/mongojs/MongoConnectionString.js" />
    <script>
     var packages = {{}}; 
    {
      for $package in $packages
      return "packages['" || fn:data($package/@id) || "'] = " 
        || fn:serialize(
             { 
               "dbtype" : ( $package/s:db-type/string(),
                            $package/s:db-types/s:db-type/string()), 
               "price": fn:data($package/s:price), 
               "isfree": empty($package/s:recurly-name), 
               "callus":($package/s:call-us eq true()) 
             }
           ) || ";"
    }
    </script>
    <div class="pane-header">
      <h2>New Project</h2>
    </div>
    <div class="pane-content container">
    { forms:layout(
        <form class="form-horizontal" id="create-project-form" method="POST" action="/projects/create" onSubmit="formSubmit()">
            <fieldset>
                <legend>Project Name</legend>
                <x:row label="Project name">
                  <input placeholder="my-awesome-queries" 
                         type="text" 
                         class="input-xlarge required" 
                         rel="popover" 
                         name="project-name" 
                         value=""  
                         data-toggle="popover" 
                         data-placement="right" 
                         data-content="&lt;p>Make sure it's awesome.&lt;/p>&lt;p>Domain names must only use the letters a to z, the numbers 0 to 9, and the hyphen (-) character. If the hyphen character is used in a domain name, it cannot be the first character in the name. For example, &lt;code>-awesome&lt;/code> would not be allowed, but &lt;code>awe-some&lt;/code> would be.&lt;/p>" 
                         data-html="true" 
                         data-trigger="focus" 
                         data-original-title="Project Name" />
                </x:row>
            </fieldset>
            <fieldset>
                <legend>Select a Plan</legend>
                <x:row label="Package">
                  <div class="select-stacked">{
                    for $package at $i in $packages
                    let $size := $package/s:max-size ! number(.)
                    let $description := project-views:parse-html($package/s:description/string())
                    let $db-types as element()+ := ( 
                        $package/s:db-type, $package/s:db-types/s:db-type )
                    return 
                      <div>
                        <label class="radio">
                          <input type="radio" name="package" value="{$package/@id}" onChange="packageselect();">{
                            if($i eq 1) then attribute checked { "true" } else ()
                          }</input>
                          { $package/s:name/string() }
                          <b class="pull-right" style="width: 120px; text-align: right;">{ $package/s:price/string() }</b>
                          <div class="well info hide">
                          {$description}
                          {
                            if(count($db-types) gt 1)
                            then
                            (
                              <hr style="margin: 10px 0px" />,
                              for $db-type at $i in $db-types
                              return
                                <label class="radio">
                                  {
                                      if($db-type/@help)
                                      then (
                                          attribute { "rel" } { "popover" },
                                          attribute { "data-toggle" } { "popover" },
                                          attribute { "data-placement" } { "right" },
                                          attribute { "data-html" } { "true" },
                                          attribute { "data-trigger" } { "hover" },
                                          attribute { "data-content" } { $db-type/@help/string() },
                                          attribute { "data-original-title" } { $db-type/@description/string() }
                                        )
                                      else ()
                                  }
                                  <input type="radio" name="{$package/@id}-db-type" value="{$db-type/text()}" onChange="dbselect();">{
                                    if($i eq 1) then attribute checked { "true" } else ()
                                  }</input>
                                  { project-views:parse-html($db-type/@description/string()) }
                                </label>
                            )
                            else ()
                          }
                          </div>
                      </label>
                    </div>
                  }</div>
                </x:row>
            </fieldset>
            <input type="hidden" name="template" value="default" />                        
            <fieldset>                   
              <legend>Bring Your Own MongoDB</legend>
              <div id="owndatabase">
              <p class="hcenter" style="margin-bottom: 20px;">
                Provide connection details for your project's MongoDB.
                <a href="https://28msec.zendesk.com/forums/22040792" target="_black">Learn More</a>. 
              </p>
              <div id="testresults" class="row">     
              {
                project-views:database-setup-form((), $test-results)          
              }                      
              </div>    
              </div>
            </fieldset>
            <div id="nodatabase" style="display:none" class="well">
              <p>No database will be used.<br/><br/>
                 For example, this is useful to test simple standalone queries 
                 or query external Web Services like the Twitter API.</p>
            </div>     
            <div id="mongolab" style="display:none" class="well">
              <p>The database will be provided by MongoLab.<br/><br/>
              The credentials are available in the "admin" section after project creation.</p>
            </div>   
            <div id="provideddatabase" style="display:none" class="well">
              <p>The database will be provided by 28.io. <br/><br/>
              Choose a different package to bring your own database.</p>
            </div>     
          <fieldset>
            <legend>Billing Information</legend>
            <div id="payment" class="row">
            {              
              project-views:payment-view($account, $recurly-billing-info, $signature)
            }
            </div>
            <div id="nopayment" style="display:none" class="well">
              <p>This type of project is free. No payment required.</p>
            </div>
             <div id="callus" style="display:none" class="alert-info">
              <p class="hcenter">
                Please get in touch.
                We will coordinate the instance setup with you.
              </p>
              <p class="hcenter">
                <a href="mailto:hello@28.io" class="btn btn-info btn-large">hello@28.io</a>
              </p>
            </div>              
            <div class="form-actions">
              <button id="create_project_button" 
                      class="btn btn-primary btn-large btn-once" 
                      type="submit" 
                      onClick="autoprogress('progress','Creating project...');">
                  Create Project
              </button>
            </div>
          </fieldset>                                     
        </form>        
      ) }    
      
  <div id="billingDialog" style="width:600px;" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" aria-hidden="true">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3>Provide Billing Information</h3>   
    </div>
    <div class="modal-body" style="max-height:800px">     
       <div id="recurly-billing-info" class="recurly"></div>     
    </div>  
   </div>
         
     <div id="progress" class="progress-space" />        
  </div>
  </div>
};

declare function project-views:payment-view($account as schema-element(s:account), $recurly-billing-info as element()?, $signature as xs:string?)
{
  if (exists($recurly-billing-info))
  then
  <div class="row-fluid">
    <div class="span6" style="border-right: 1px solid rgb(221, 221, 221);">     
      <x:row label="Card Holder">
        <span id="billing_available" class="uneditable-input">
        { 
          data($recurly-billing-info/first_name) || " " || data($recurly-billing-info/last_name) 
        }
        </span>
      </x:row>
      <x:row label="Credit Card">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/card_type) || " : " || data($recurly-billing-info/first_six) || "**********" 
        }  
        </span>
      </x:row>
      <x:row label="Card Expire Date">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/month) || " / " || data($recurly-billing-info/year) 
        }  
        </span>
      </x:row>
       <x:row label="Package Price">
        <span class="uneditable-input" id="price">
          ?  
        </span>
      </x:row>
    </div>
    <div class="span6">
      <p>Something changed? Click here:</p>
      <button id="billingbutton" type="button" onClick="updateBilling('{fn:data($account/s:billing-account)}','{$signature}',false,'{ if (config:is-billing-test()) then "28msec-test" else if (config:is-billing-dev()) then "28msec-dev" else "28msec" }');" class="btn">Update Billing Information</button>
    </div>
  </div>
  else
  <div>   
    <div class="span6" style="border-right: 1px solid rgb(221, 221, 221);">     
      <x:row label="Package Price">
        <span class="uneditable-input" id="price">
          ?  
        </span>
      </x:row>
    </div>
    <div class="span5">
      <p>You have not provided billing information yet.</p>
      {
        if ($account/s:billing-account)
        then <button id="billingbutton" type="button" onClick="updateBilling('{fn:data($account/s:billing-account)}','{$signature}',false, '{ if (config:is-billing-test()) then "28msec-test" else if (config:is-billing-dev()) then "28msec-dev" else "28msec" }');" class="btn">Enter Billing Information</button>
        else <button id="billingbutton" type="button" onClick="updateBilling('{fn:data($account/s:billing-account)}','{$signature}',true, '{ if (config:is-billing-test()) then "28msec-test" else if (config:is-billing-dev()) then "28msec-dev" else "28msec" }');" class="btn">Enter Billing Information</button>
      }
    </div>    
  </div>
};


declare function project-views:delete-project($project as schema-element(s:project), $package as schema-element(s:package)) {
  
  <div class="content">
     <div class="pane-header">
        <h2>Cancel Project Subscription</h2>
        <div id="submenu"></div>
     </div>
     <div class="pane-content container">        
    <table class="table table-bordered">
      <tr>
        <td>Project Name</td><td>{fn:data($project/@name)}</td>
      </tr>
      <tr>
        <td>Package</td><td>{fn:data($package/s:name)}</td>
      </tr>
      <tr>
        <td>Price</td><td>{fn:data($package/s:price)}</td>
      </tr>
    </table> 
    { 
        if ($project/s:database/s:db-type eq "mongolab")
        then (                                               
          <div class="alert alert-info">Your MongoLab database will be deleted!</div>
        )
        else ()
    }                            
    <div class="alert alert-info">
      If you cancel your project subscription your stored queries will be deleted.
    </div>
    <div class="alert alert-info">
      The project name remains reserved for you for 24 hours.
    </div>
    <div class="form-actions">
      <form method="post" action="/projects/delete">
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <button type="submit" name="ac" value="delete" class="btn btn-large btn-danger btn-once" onClick="autoprogress('progress','Deleting...');">Cancel Project Subscription</button>
      </form>        
    </div>
    <div id="progress" class="progress-space" />
    </div>
  </div>
};

declare function project-views:copy-project($project as schema-element(s:project)) {
   <div class="content">
      <h2>Copy Project</h2>      
      <p>If you need another instance of your project you can copy it here,</p>
      { forms:layout(    
      <form class="form-horizontal" method="POST" action="/projects/copy">
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <x:row label="Old project"><input type="text" disabled="disabled" name="old-project" size="30" value="{fn:data($project/@name)}"/></x:row>               
        <x:row label="New project"><input type="text" name="target-name" size="30" value=""/></x:row>
        <x:row label="Database"><input type="checkbox" name="copydb" value="true"/>Also copy database</x:row>        
        <div class="form-actions">      
          <button class="btn btn-primary" onClick="autoprogress('progress','Copying project...');">Submit</button>
        </div>
      </form>   
      ) }
     <div id="progress" class="progress-space" />
    </div>
};

declare function project-views:rename-project($project as schema-element(s:project)) {
   <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
    </script>
     <div class="pane-header">
        <h2>Rename Project</h2>
        <div id="submenu"></div>
     </div>
     <div class="pane-content container">              
      { forms:layout(         
      <form class="form-horizontal" method="POST" action="/projects/rename">      
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <legend>Rename Project</legend>
        <fieldset>         
          <x:row label="Old name"><input type="text" disabled="disabled" size="30" value="{fn:data($project/@name)}"/></x:row>
          <x:row label="New name"><input type="text" name="target-name" size="30" value=""/></x:row>               
          <div class="form-actions">      
            <button class="btn btn-primary btn-once" onClick="autoprogress('progress','Renaming project...');">Submit</button>
          </div>
        </fieldset>
      </form>   
      ) }
     <div id="progress" class="progress-space" />
     </div>
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
   </div>
};

declare function project-views:upgrade-project(
    $account as schema-element(s:account),
    $project as schema-element(s:project), 
    $packages as schema-element(s:package)*,
    $recurly-billing-info as element()?, 
    $signature as xs:string?)
as element(div)
{
  <div class="content">
     <script src="/portaljs/create-project.js" />
     <script>
     var packages = {{}}; 
    {
      for $package in $packages
      where not(empty($package/s:recurly-name))
      return "packages['" || fn:data($package/@id) || "'] = " 
        || fn:serialize(
             { 
               "dbtype" : ( $package/s:db-type/string(),
                            $package/s:db-types/s:db-type/string()), 
               "price": fn:data($package/s:price), 
               "isfree": empty($package/s:recurly-name), 
               "callus":($package/s:call-us eq true()) 
             }
           ) || ";"
    }
    </script>
     <div class="pane-header">
        <h2>Upgrade Project Subscription</h2>
        <div id="submenu"></div>
     </div>
     <div class="pane-content container">        
       <table class="table table-bordered">
        <tr>
          <td>Project Name</td><td>{fn:data($project/@name)}</td>
        </tr>
        <tr>
          <td>Package</td><td>Free</td>
        </tr>
        <tr>
          <td>Price</td><td>free</td>
        </tr>
      </table> 
    { forms:layout(
        <form class="form-horizontal" id="create-project-form" method="POST" action="/projects/upgrade" onSubmit="formSubmit()">      
            <input type="hidden" name="project" value="{fn:data($project/@name)}" />
            <fieldset>
                <legend>Select a Plan</legend>
                <x:row label="Package">
                  <div class="select-stacked">{
                    for $package in $packages
		    where not(empty($package/s:recurly-name)) and fn:data($package/@id) ne $project/s:package/string()
		    count $i
                    let $size := $package/s:max-size ! number(.)
                    let $description := project-views:parse-html($package/s:description/string())
                    let $db-types as element()+ := ( 
                        $package/s:db-type, $package/s:db-types/s:db-type )
                    return <div>
                                <label class="radio">
                                  <input type="radio" name="package" value="{fn:data($package/@id)}" onChange="packageselect();">{
                                    if($i eq 1) then attribute checked { "true" } else ()
                                  }</input>
                                  { $package/s:name/string() }
                                  <b class="pull-right" style="width: 120px; text-align: right;">{ $package/s:price/string() }</b>
                                  <div class="well info hide">
                                  {$description}
                                  </div>
                                </label>
                           </div>
                  }</div>
              </x:row>
            </fieldset>
            <input type="hidden" name="template" value="default" />
	  <fieldset>
	    <legend>Billing Information</legend>
	    <div id="payment" class="row">
	    {              
	      project-views:payment-view($account, $recurly-billing-info, $signature)
	    }
	    </div>
            <div id="nopayment" style="display:none" class="well">
              <p>This type of project is free. No payment required.</p>
            </div>
             <div id="callus" style="display:none" class="alert-info">
              <p class="hcenter">
                Please get in touch.
                We will coordinate the instance setup with you.
              </p>
              <p class="hcenter">
                <a href="mailto:hello@28.io" class="btn btn-info btn-large">hello@28.io</a>
              </p>
            </div> 
	    <div class="form-actions">
	      <button id="create_project_button" 
		      class="btn btn-primary btn-large btn-once" 
		      type="submit" 
		      onClick="autoprogress('progress','Upgrading project...');">
		  Upgrade Project
	      </button>
	    </div>
	  </fieldset> 
	</form>
      ) }    
  <div id="billingDialog" style="width:600px;" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" aria-hidden="true">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3>Provide Billing Information</h3>   
    </div>
    <div class="modal-body" style="max-height:800px">     
       <div id="recurly-billing-info" class="recurly"></div>     
    </div>  
   </div>
         
     <div id="progress" class="progress-space" />        
  </div>
  </div>  
};

declare function project-views:database-view($project as schema-element(s:project), $test-results as element()?) 
{
  variable $package := packages:package-by-id($project/s:package);
  variable $db-types as element()+ := ( 
      $package/s:db-type, $package/s:db-types/s:db-type );

  <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
        var oldDBType = projectDBType;
    </script>
    <script src="/portaljs/update-project.js" />
    <script src="/portaljs/byomongodb.js" />
    <script src="/mongojs/URI.js" />
    <script src="/mongojs/MongoConnectionString.js" />
    <div class="pane-header">
      <h2>Default MongoDB</h2>
      <div id="submenu"></div>
    </div>
    <br/>
    <div class="pane-content container">
    {  
        let $db-type as xs:string := $project/s:database/s:db-type/string()
        return
            if ( count($db-types) gt 1 )
            then forms:layout(
                <form class="form-horizontal" 
                      id="database-form" 
                      method="POST" 
                      action="/admin/dbconfig">
                    <input type="hidden" name="package" value="{ data($project/s:package) }" />
                    <input type="hidden" name="project" value="{ data($project/@name) }" />                 
                    <div class="select-stacked" 
                         id="change-db-settings" 
                         style="width: 100% !important">{
			 (
                             if ( count($db-types[./text() eq "user"]) gt 0 ) 
                             then 
                                <div>
                                {
                                    variable $description := 
                                      project-views:parse-html(
                                        $db-types[./text() eq "user"]/@description/string());
                                    variable $help := $db-types[./text() eq "user"]/@help;

                                    <label class="radio">
                                        {
                                            if($help)
                                            then (
                                                attribute { "rel" } { "popover" },
                                                attribute { "data-toggle" } { "popover" },
                                                attribute { "data-placement" } { "bottom" },
                                                attribute { "data-html" } { "true" },
                                                attribute { "data-trigger" } { "hover" },
                                                attribute { "data-content" } { $help/string() },
                                                attribute { "data-original-title" } { serialize($description) }
                                              )
                                            else ()
                                        }
                                        <input type="radio" 
                                               name="db-type" 
                                               value="user" 
                                               onChange="dbtypeSelected();">{
                                                if($db-type eq "user") 
                                                then attribute checked { "true" } 
                                                else ()
                                        }</input>
                                        {
                                          $description
                                        }
                                    </label>,
                                    <div id="BYO">
                                        <div id="owndatabase">
                                            { 
                                               let $style as xs:string := "padding-top: 15px;"
                                               return
                                                 attribute style { 
                                                     if($db-type eq "user") 
                                                     then $style 
                                                     else $style || "display:none;" } 
                                            }
                                            <!--<p class="hcenter" style="margin-bottom: 20px;">Enter the access information for the MongoDB database that you want to use with this project.</p>-->
                                            <div id="testresults" class="row">     
                                            {
                                              project-views:database-setup-form($project, $test-results)          
                                            }                       
                                            </div>    
                                        </div>
                                    </div>
                                }
                                </div>
                              else (),
                              if ( count($db-types[./text() eq "mongolab"]) gt 0 ) 
                              then
                                <div>
                                {
                                    variable $description := 
                                      project-views:parse-html(
                                        $db-types[./text() eq "mongolab"]/@description/string());
                                    variable $help := $db-types[./text() eq "mongolab"]/@help;

                                    <label class="radio">                            
                                        <label>
                                        {
                                            if($help)
                                            then (
                                                attribute { "rel" } { "popover" },
                                                attribute { "data-toggle" } { "popover" },
                                                attribute { "data-placement" } { "top" },
                                                attribute { "data-html" } { "true" },
                                                attribute { "data-trigger" } { "hover" },
                                                attribute { "data-content" } { $help/string() },
                                                attribute { "data-original-title" } { serialize($description) }
                                              )
                                            else ()
                                        }
                                        <input type="radio" 
                                               name="db-type"  
                                               value="mongolab" 
                                               onChange="dbtypeSelected();">{
                                                if($db-type eq "mongolab") 
                                                then attribute checked { "true" } 
                                                else ()
                                        }</input>
                                        { $description }&#160;&#160;
                                        { 
                                            if ($db-type eq "mongolab")
                                            then (
                                              <button class="btn" id="show-password" type="button" onClick="ajax('/admin/show-mongolabpassword','database-form','password-container');">Show password in plain text.</button>                                      
                                            )
                                            else ()
                                        }
                                        </label>
                                        <div id="mongolab"></div>
                                         { 
                                            if ($db-type eq "mongolab")
                                            then (                                     
                                              <div>&#160;</div>,
                                              <div class="alert alert-warning">If you switch to another database or cancel the project subscription your MongoLab database will be automatically deleted.</div>, 
                                            
                                              <a target="_blank" href="/admin/mongolab-sso?project={encode-for-uri($project/@name)}">Manage your account directly on the MongoLab website.</a>                                                                         
                                            )
                                            else ()
                                        }
                                    </label>
                                                             
                                }
                                </div>
                              else (),
                              if ( count($db-types[./text() eq "none"]) gt 0 ) 
                              then
                                <div>
                                {
                                    variable $description := 
                                      project-views:parse-html(
                                        $db-types[./text() eq "none"]/@description/string());
                                    variable $help := $db-types[./text() eq "none"]/@help;

                                    <label class="radio">
                                        {
                                            if($help)
                                            then (
                                                attribute { "rel" } { "popover" },
                                                attribute { "data-toggle" } { "popover" },
                                                attribute { "data-placement" } { "top" },
                                                attribute { "data-html" } { "true" },
                                                attribute { "data-trigger" } { "hover" },
                                                attribute { "data-content" } { $help/string() },
                                                attribute { "data-original-title" } { serialize($description) }
                                              )
                                            else ()
                                        }
                                        <input type="radio" 
                                               name="db-type" 
                                               value="none" 
                                               onChange="dbtypeSelected();">{
                                                if($db-type eq "none") 
                                                then attribute checked { "true" } 
                                                else ()
                                        }</input>
                                        { $description }
                                    </label>
                                }
                                </div>
                              else ()
                          )
                    }</div>                 
                    <div class="form-actions">
                        <button id="update_project_button" 
                                class="btn btn-primary btn-large btn-once" 
                                type="submit">Change Database</button>
                    </div>             
                </form>
            )
            else if ($db-type eq "user")
            then forms:layout(
                <form class="form-horizontal" 
                      id="database-form" 
                      method="POST" 
                      action="/admin/dbconfig">
                    <div id="change-db-settings">
                    <legend>Bring Your Own MongoDB</legend>
                    <input type="hidden" name="package" value="{ data($project/s:package) }" />
                    <input type="hidden" name="project" value="{ data($project/@name) }" />
                    <div id="owndatabase">
                        <!--<p class="hcenter" style="margin-bottom: 20px;">Enter the access information for the MongoDB database that you want to use with this project.</p>-->
                        <div id="testresults" class="row">
                        {
                            project-views:database-setup-form($project, $test-results)
                        }
                        </div>
                    </div>
                  </div>
                  <div class="form-actions">
                      <button class="btn btn-primary btn-large btn-once" type="submit">Change Database</button>
                  </div>
               </form>
              )
            else
                <div class="alert alert-info">
                  The database for this project is provided by 28.io. <br/><br/>The access credentials cannot be changed.
                </div>
     }                  
    </div>
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
  </div>
};

declare function project-views:database-setup-form($project as schema-element(s:project)?, $test-results) { 
  <div class="row-fluid">
    <div class="span12">            
      <x:row label="Connection String" id="conn-string-group">
        <input type="text" class="input-xxlarge" name="conn-string-visible" id="conn-string-visible" value="{fn:data($project/s:database/s:conn-string)}" placeholder="e.g.: host:port or mongodb://.."
        rel="popover"
        data-html="true"
        data-placement="top"
        data-trigger="focus"
        data-original-title="Connection String"
        data-content="Different formats are supported to define how your 28.io project connects to your MongoDB database server.&lt;br/>&lt;br/>Some examples: &lt;ul>&lt;li>&lt;code>mongodb://username:password@host:port/database&lt;/code>&lt;/li>&lt;li>&lt;code>mongodb://username:password@host:port,host2:port2/database?replicaSet=test&lt;/code>&lt;/li>&lt;li>&lt;code>server&lt;/code>&lt;/li>&lt;li>&lt;code>server:port&lt;/code>&lt;/li>&lt;li>&lt;code>server:port/database&lt;/code>&lt;/li>&lt;li>&lt;code>replica-set/server1:port,server2:port&lt;/code>&lt;/li>&lt;/ul>"/>
       <input type="hidden" name="conn-string" id="conn-string-input" value="{fn:data($project/s:database/s:conn-string)}"/>
      </x:row>      
      <div class="row-fluid">
        <div class="span6 db-params">            
          <x:row label="Database Name" id="dbname-group">
            <input type="text" name="dbname" id="dbname-input" value="{fn:data($project/s:database/s:db-name)}"
            rel="popover"
            data-placement="right"
            data-trigger="focus"
            data-original-title="Database Name"
            data-content="Name of your database."
            placeholder="uss-enterprise"
            />
          </x:row>
          <x:row label="Username" id="username-group">
            <input type="text" name="username" id="username-input" value="{fn:data($project/s:database/s:username)}" placeholder="kirk"
            rel="popover"
            data-placement="right"
            data-trigger="focus"
            data-original-title="Username"
            data-content="The user that will be used to connect to your database. The user needs to have write access (&lt;a href='https://28msec.zendesk.com/entries/23678953-Why-does-28-io-need-write-access-to-my-database-' target='_blank'>Why?&lt;/a>)."
            data-html="true"
            />
          </x:row>
          <div id="password-container">
          <x:row label="Password" id="password-group">
            <input type="password" name="password" id="password-input" value="{if (data($project/s:database/s:password)) then $project-views:keep-password else "" }"
            rel="popover"
            data-placement="right"
            data-trigger="focus"
            data-original-title="Password"
            data-content="The password for the given user in plain text." 
            />
          </x:row>       
          </div>
        </div>
        <div class="span6 db-test">
          <button class="btn btn-info btn-once" type="button" id="run-test" onClick="dbtest(); return false;">Check Database Connection</button>
          <div id="testresults2">
          {$test-results}
          </div>
        </div>
      </div>
    </div>
  </div>
};

declare function project-views:database-test-result($result as object())
{
  <div>
   <ul class="unstyled" style="margin-top: 20px;">
     { 
      for $test in jn:members($result("tests"))
      return 
        if ($test("success"))
        then 
          <li class="text-success">
            <b>&#x2713;</b>&#160;
            { 
                $test("message")
            }
          </li>
        else
          <li class="text-error">
            <b>&#x2717;</b>&#160;
            { $test("message") }
          </li>
     }  
    </ul>
 </div>
};

declare function project-views:format($input)
{
  if ($input castable as xs:integer)
  then
    if (xs:integer($input) > 1000)
    then xs:string(xs:integer($input) idiv 1000) || "k"
    else xs:string($input)
  else if ($input = "shared") 
  then "Shared"
  else if ($input = "user") 
  then "Your Own"
  else if ($input = "28msec") 
  then "28msec"
  else $input 
};

declare function project-views:format-bool($input as xs:boolean?)
{
  if ($input = true())
  then "✔"
  else "x"  
};

declare function project-views:format-size($input as xs:integer?)
{
  if (empty($input))
  then " "
  else if ($input > 1024)
  then xs:string($input idiv 1024) || " GB"
  else xs:string($input) || " MB"
};

declare function project-views:package-table($packages as schema-element(s:package)*)
{
  <table class="table table-striped table-bordered">
    <tr>
      <td>Name</td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:name) }</td>
      }
    </tr>
    <tr>
      <td>Price</td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:price) }</td>
      }
    </tr>  
    <tr>
      <td>Database</td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:db-type) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="Total size of the MongoDB database associated to your project."
                    data-original-title="Database Size">Database Size</a></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format-size($package/s:max-size) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="Number of instances running JSONiq queries."
                    data-original-title="Query Servers">Query Servers</a></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:server-type) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="Number of top level queries that can be executed."
                    data-original-title="Automatic Scalability">Query Executions</a> <span style="color: grey;">+ $0.4 every 1000 requests</span></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:query-executions) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="28.io allows you to dispatch query execution automatically to available servers."
                    data-original-title="Automatic Scalability">Automatic Scalability</a></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format-bool(true()) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="28.io allows you to parallize query evaluation and to distribute the query processing over a cluster of servers - speeding up evaluation on large datasets."
                    data-original-title="Query Parallelization">Query Parallelization</a></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format-bool($package/s:parallelization) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="Never get stucked, we're here to help."
                    data-original-title="Support Tickets">Support Tickets</a> <span style="color: grey;">+ $250 per addtionnal ticket</span></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format($package/s:tickets) }</td>
      }
    </tr>
    <tr>
      <td><a href="#" rel="popover" data-placement="right"
                    data-content="Hands-on sessions on all aspects of 28.io, customized to your needs."
                    data-original-title="Personalized 1-day Training">Personalized 1-day Training</a></td>
      {
        for $package in $packages
        return <td class="package package_{fn:data($package/@id)}">{ project-views:format-bool($package/s:training) }</td>
      }
    </tr>
  </table>
};
