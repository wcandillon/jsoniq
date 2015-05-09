xquery version "3.0";
module namespace admin-views = "http://portal.28.io/views/admin-views";

import module namespace forms = "http://portal.28.io/util/forms";
import module namespace config = "http://portal.28.io/util/config";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare function admin-views:custom-domains($project as schema-element(s:project), $domains as schema-element(s:domain)*)
{
   <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
    </script>
    <div class="pane-header">
         <h2>Custom Domains</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
     { forms:layout(     
       <form class="form-horizontal" id="create-domain-form" method="POST" action="/admin/add-custom-domain" onSubmit="formSubmit()">
         <legend>Add custom domain</legend>       
          <fieldset>
            <input type="hidden" name="project" value="{fn:data($project/@name)}" />
            <x:row label="New Domain">
              <div class="input-append">
                <input type="text" class="input-xlarge required" name="domain-name" value=""/><button class="btn btn-primary btn-once" type="submit" name="ac" value="add">Add</button>
              </div>
            </x:row>                        
          </fieldset>                    
        </form>        
      ) }  
    {
      if (fn:empty($domains))
      then 
      (
        <p>No custom domains added for this project.</p>
      )
      else 
      (
      <form class="form-horizontal" id="remove-domain-form" method="POST" action="/admin/remove-custom-domain" onSubmit="formSubmit()">
        <legend>Remove custom domain</legend>          
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <fieldset>  
        <table class="table table-bordered" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <th></th>
            <th>Domain Name</th>            
          </tr>        
          {
            for $domain in $domains
            order by $domain/@name ascending
            return
              <tr>
                <td><input type="radio" name="domain" value="{fn:data($domain/@name)}"/></td>
                <td>{ fn:data($domain/@name) }</td>
              </tr>
          }     
        </table>  
        </fieldset>        
        <button class="btn btn-once btn-danger" type="submit">Remove Domain</button>
       
      </form>
      )
      }      
    </div>
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
  </div>
};


declare function admin-views:general-options($project as schema-element(s:project), 
                                             $package as schema-element(s:package),
                                             $message as object()?)
{
  <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
        var upgradeMessage={
            if(exists($message))
            then serialize($message)
            else "null"
        };
    </script>
   <div class="pane-header">
         <h2>Administration</h2>
         <div id="submenu"></div>
    </div>
    <div class="container" ng-init="processAlerts();">
        <div class="alert fade" style="line-height: auto;" ng-repeat="alert in alerts" bs-alert="alert"></div>
    </div>
    <div class="pane-content container">
      <table class="table table-bordered table-striped">
        <tr>
          <td>Project Name</td><td>{fn:data($project/@name)}</td>
        </tr>
        <tr>
          <td>Package</td><td>{fn:data($package/s:name)}</td>
        </tr>       
        <tr>
          <td>API URL</td><td>{ config:project-url($project/@name) }</td>
        </tr>                      
        <tr>
          <td>Creation Date</td><td>{fn:format-dateTime($project/s:created, "[Y]-[M01]-[D01], [H]:[m]")}</td>
        </tr>  
        <tr>
          <td>28.io Version</td><td>{fn:data($project/s:sausa-version)}</td>
        </tr>
    </table>
    {
      if ($package/@id eq "free" and $project/s:database/s:db-type ne "mongolab")
      then <a class="btn btn-success btn-once" style="margin-right: 10px" href="/projects/show-upgrade?project={fn:encode-for-uri($project/@name)}">Upgrade Subscription</a> 
      else ()
    }
    <a class="btn btn-danger btn-once" href="/projects/show-delete?project={fn:encode-for-uri($project/@name)}">Cancel Subscription</a>
    { ()
  (:
    <h2>General</h2>
    <table width="100%" border="0" cellspacing="0" cellpadding="0"><tr style="vertical-align:top"><td width="50%">   
    <h3>Delete Data</h3>
    <p>Delete the data in all collections.</p>
    <a href="/admin/show-delete-data?project={fn:encode-for-uri($project/@name)}" class="btn btn-once">Start</a>
    </td><td width="50%">
    <h3>Recompile Project</h3>
    <p>Force complete recompilation of the project.</p>
     <div>
      <form method="post" action="/admin/force-recompile">
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <button type="submit" name="ac" onClick="autoprogress('progress','Recompiling project...');" value="Recompile Project" class="btn btn-once">Start</button>
      </form>        
    </div>
    </td></tr>
    </table>
  :) }
    <div id="progress" class="progress-space" />
    <hr />
    
  </div>
  
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
  </div>
};

declare function admin-views:delete-data($project as schema-element(s:project)) {
  <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
    </script>
    <h2>Delete Data</h2>
    <p>You can reset the data of the project '{fn:data($project/@name)}'.</p>
    <div class="alert alert-error">
      This cannot be undone!
    </div>           
    <div>
      <form method="post" action="/admin/delete-data">
        <input type="hidden" name="project" value="{fn:data($project/@name)}" />
        <button type="submit" name="ac" value="delete" class="btn btn-primary btn-once" onClick="autoprogress('progress','Deleting...');">Delete Data</button>
      </form>        
    </div>
    <div id="progress" class="progress-space" />
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
  </div>
};

declare function admin-views:error-list($project as schema-element(s:project), $errors as schema-element(s:error)*)
{  
  <div class="content" ng-app="admin" ng-controller="AdminCtrl">
    <script type="text/javascript">
        var projectVersion="{$project/s:sausa-version/string()}";
        var latestSausaVersion="{config:current-release()}";
        var projectName="{$project/@name/string()}";
        var projectDBType="{$project/s:database/s:db-type/string()}";
    </script>     
    {
      if (fn:empty($errors))
      then <div><br/><br/>No errors found.<br/><br/></div>
      else
    <table width="100%" cellspacing="3" cellpadding="3" border="0">
    <thead>
      <tr>
        <th style="text-align:left">Module</th>
        <th style="text-align:left">Pos</th>        
        <th style="text-align:left">Error</th>
      </tr>
    </thead>
    {
      
      for $error in $errors
      let $path := "/fs/workspace/" || fn:data($project/@name) || "/" || fn:data($error/s:module-path) 
      let $row := ($error/s:line, 0)[1]
      let $column := ($error/s:column, 0)[1]
      return
       <tr>
         <td>
           <a href="javascript:" onClick='var cs = require("ext28/compilestatus/compilestatus");cs.openFile("{$path}", {fn:data($row)}, {fn:data($column)});'>{fn:data($error/s:module-path) }</a>
         </td>
         <td>
           { fn:data($error/s:line) }:{ fn:data($error/s:column) }
         </td>         
         <td>
           { fn:data($error/s:message) }
         </td>
       </tr>
    }
    </table>
    }
    <script src="{$config:cdn}/js/angular-strap.js"></script>
    <script src="{$config:cdn}/js/admin.js"></script>
  </div>
};
