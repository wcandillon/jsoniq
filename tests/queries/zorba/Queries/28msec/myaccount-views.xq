xquery version "3.0";
module namespace myaccount-views = "http://portal.28.io/views/myaccount-views";

import module namespace forms = "http://portal.28.io/util/forms";
import module namespace config = "http://portal.28.io/util/config";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare variable $myaccount-views:support-price as xs:integer := 250;

declare function myaccount-views:summary() {
  <div class="content">
      <h2>Manage your account</h2>
      <div class="inpagemenu">
        <div>
         <a href="/myaccount/show-change-password">Change Account Password</a>
         <span>Change your password</span>
        </div>
        <div>
         <a href="/myaccount/show-billing">Billing Info</a>
         <span>Provide or update payment information.</span>
        </div>
        <div>
         <a href="/myaccount/show-invoices">Invoices</a>
         <span>View and download invoices.</span>
        </div>
        { (: NOT-FOR-V1
        <div>
         <a href="/myaccount/show-emailsettings">Change eMail</a>
         <span>Change your eMail and newsletter settings</span>
        </div>
       
        <div>
          <a href="/myaccount/show-statistics">Usage Statistics</a>
          <span>View or download information about current or past periods</span>
        </div>
        :) () }
      </div>
  </div>
};

declare function myaccount-views:not-in-coresdk($title as xs:string)
{
  <div class="content">
    <div class="pane-header">
      <h2>{ $title }</h2>
      <div id="submenu"></div>
    </div>
    <div class="pane-content container">
       <div class="alert">
         This function is not available for this type of server instance.
       </div>    
    </div>
  </div>
};

declare function myaccount-views:set-password($account) {
  let $email := $account/s:email/string()
  return
  <div class="content">
    <div class="pane-header">
         <h2>Change Password</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
      { forms:layout(
       <form action="/myaccount/change-password" method="POST" class="form-horizontal">
        <legend>Change Password</legend>
        <fieldset>        
        <input type="hidden" name="email" value="{$email}" />
        <x:row label="EMail"><input type="text" disabled="disabled" value="{$email }" /></x:row>
        <x:row label="Password"><input type="password" name="password" size="30" /></x:row>
        <x:row label="Repeat Password"><input type="password" name="repetition" size="30" /></x:row>
        <div class="form-actions">
          <button class="btn btn-primary btn-once btn-large" type="submit">Submit</button>
        </div>    
        </fieldset>    
      </form>         
      ) }       
    </div>
  </div>
};

declare function myaccount-views:email-settings() {
  <div class="content">
      <h2>eMail Settings</h2>
      { forms:layout(
      <form action="/myaccount/myaccount" method="POST" class="form-horizontal">
        <fieldset>
        <x:row label="EMail address"><input type="text" name="email" size="30" value="exampleuser@domain.com"/></x:row>
        <x:row label="Notifications"><span><input type="radio" name="notifications" value="yes" checked="checked" />yes <input type="radio" name="notifications" value="no" />no</span></x:row>
        <x:row label="Newsletter"><span><input type="radio" name="newsletter" value="yes" checked="checked"/>yes <input type="radio" name="newsletter" value="no" />no</span></x:row>        
        <div class="form-actions">
          <button class="btn btn-primary btn-once" type="submit">Submit</button>
        </div>
        </fieldset>
      </form>        
      ) }        
    </div>
};

declare function myaccount-views:not-supported($title as xs:string)
{
 <div class="content">
   <div class="pane-header">
     <h2>{ $title }</h2>
     <div id="submenu"></div>
   </div>
   <div class="pane-content container">
     <p>This function is not supported for non billing accounts.</p>
   </div>
 </div>
};

declare function myaccount-views:update-account($account as schema-element(s:account)) 
{
 <div class="content" ng-app="">
    <script src="{$config:cdn}/js/update-account.js" />
    <div class="pane-header">
         <h2>Account</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container" ng-controller="UpdateAccountCtrl">     
      <form class="form-horizontal" ng-submit="submit()">
       <legend>Profile</legend>
        <div class="alert alert-success" ng-show="success">Your profile information has been successfully changed</div>
        <div class="alert alert-error" ng-show="error">{{{{ error }}}}</div>
        <fieldset> 
      <div id="firstname_group" class="control-group">
          <label class="control-label" for="firstname">First Name</label>
	      <div class="controls">
	         <input type="text" name="firstname" ng-model="model.firstname"/>
	      </div>
	  </div> 
	  <div id="lastname_group" class="control-group">
	      <label class="control-label" for="lastname">Last Name</label>
	      <div class="controls">
	         <input type="text" name="lastname" ng-model="model.lastname"/>
	      </div>
	  </div>
      <!--
	  <div class="control-group">
	      <label class="control-label" for="email">Email</label>
	      <div class="controls">
	         <input type="text" name="email" value="{req:parameter-values('email')}" />
	      </div>
	  </div>
      -->
	  <div id="company_group" class="control-group">
	      <label class="control-label" for="company">Company</label>
	      <div class="controls">
	         <input type="text" name="company" ng-model="model.company"/>
	      </div>
	  </div>
	 
        </fieldset>
        <div class="form-actions">
          <button class="btn btn-primary btn-large" ng-disabled="working" type="submit">Update Account</button>	 
        </div>
      </form>
  
    </div> 
  </div>
};

declare function myaccount-views:billing-form($account as schema-element(s:account), $recurly-billing-info, $signature as xs:string)
{
  <div class="content">
    <div class="pane-header">
         <h2>Billing Info</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
   <script src="/portaljs/update-billing.js" />
  {
  if (exists($recurly-billing-info))
  then forms:layout(
  <form class="form-horizontal" style="clear: both;"><fieldset>
      <legend>Billing Information</legend>
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
      <x:row label="Address">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/address1) 
        }  
        </span>
      </x:row>        
      <x:row label="Address Line 2">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/address2) 
        }  
        </span>
      </x:row>
      <x:row label="City">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/city) 
        }  
        </span>
      </x:row>
      <x:row label="Zip or postal code">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/zip) 
        }  
        </span>
      </x:row>
      <x:row label="State">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/state) 
        }  
        </span>
      </x:row>
      <x:row label="Country">
        <span class="uneditable-input">
        { 
          data($recurly-billing-info/country) 
        }  
        </span>
      </x:row>         
  </fieldset></form>
  ) else <p>No billing information provided.</p>}
  
  <div class="form-actions">
    <button id="billingbutton" type="button" onClick="updateBilling2('{fn:data($account/s:billing-account)}','{$signature}',{empty($account/s:billing-acount)},'{ if (config:is-billing-test()) then "28msec-test" else if (config:is-billing-dev()) then "28msec-dev" else "28msec" }');"
            class="btn btn-primary btn-large">Update Billing Information</button>
  </div>
  <div id="billingDialog" style="width:600px;" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3>Provide Billing Information</h3>   
    </div>
    <div class="modal-body" style="max-height:800px">     
       <div id="recurly-billing-info" class="recurly"></div>     
    </div>  
  </div>
  </div>
 </div>
};

declare function myaccount-views:invoice-list($account, $recurly-invoices)
{
   <div class="content">
    <div class="pane-header">
         <h2>Invoices</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
     {
       if (empty($recurly-invoices))
       then  
         <p>You currently do not have any invoices.</p>
       else (
         <table class="table table-striped table-bordered">
           <tr>
             <th>Invoice ID</th>
             <th>Date</th>
             <th style="text-align:right">Amount</th>
             <th>Status</th>         
           </tr>
           {
             for $invoice in $recurly-invoices
             order by $invoice/created_at descending
             return
               <tr>
                 <td>
                   <a target="_blank" href="/myaccount/invoice?invoice={fn:data($invoice/uuid)}">#&#160;{fn:data($invoice/invoice_number)}</a>
                 </td>
                 <td>
                   {fn:format-dateTime($invoice/created_at, "[Y]-[M01]-[D01], [H]:[m]")}
                 </td>
                 <td style="text-align:right">{ fn:data($invoice/total_in_cents) div 100}&#160;{ fn:data($invoice/currency) }</td>
                 <td>{ fn:data($invoice/state) }</td>
               </tr>
           }
         </table>
       )
      }          
   </div>
 </div>
};

declare function myaccount-views:support-list-nobilling($account as schema-element(s:account))
{
<div class="content">
    <div class="pane-header">
         <h2>Support Tickets</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">           
       <div style="clear:both" class="alert alert-warn">Please provide your <a href="/myaccount/show-billing">billing information</a> before purchasing support tickets.</div>
       <p style="clear:both">You currently do not have any support subscription. </p>
       <h4>Do you need help right now?</h4>
      <a target="_blank" href="https://28msec.zendesk.com">Visit our support site</a>      
    </div>
 </div>
};
     

declare function myaccount-views:support-list($account as schema-element(s:account), $support-tickets as element(s:support-ticket)*)
{
     let $paid-tickets := xs:integer($support-tickets[@support]/@count)
     return
<div class="content">
    <div class="pane-header">
         <h2>Support Tickets</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
   
     {
       if (empty($support-tickets))
       then  
         <p style="clear:both">You currently do not have any support subscription.</p>
       else (
         <table class="table table-striped table-bordered">
           <tr>            
             <th>Package(s)</th>
             <th>Support Tickets / Month</th>             
           </tr>
           {
             for $ticket in $support-tickets             
             return
               <tr>                 
                 <td>
                   { data($ticket/@name) }
                 </td>
                 <td>
                   { data($ticket/@count) }
                 </td>
               </tr>
           }
           <tr class="success">
               <td><b>Total</b></td>
               <td><b>{ fn:sum($support-tickets/@count) }</b></td>
           </tr>
         </table>
       )
      }          
      
      <form method="POST" action="/myaccount/support" class="form-inline" style="clear: both;">
        <fieldset>
          <div id="formControl" class="control-group">
          <select id="actionType" name="type" onChange="updateTicket();">
              <option value="add" selected="selected">Buy additional</option>
              <option value="remove">Cancel</option>
          </select>          
          <span class="add-on">&#160;</span>
          <input id="quantity" class="input-mini" type="text" value="1" name="quantity" maxlength="2" size="2" onKeyUp="updateTicket();" onChange="updateTicket();"/>
          <span class="add-on">&#160;</span>
          <span class="add-on">Support Tickets per Month. </span>         
          </div>
          <p style="margin-top:5px; margin-bottom:20px" id="ticket-info">1 additional Ticket will cost { $myaccount-views:support-price } USD per month.</p>
          <button id="supportSubmit" class="btn btn-primary btn-once" type="submit">Do it</button>
        </fieldset>
      </form>
      
      <script>
          function updateTicket() {{             
              var q = $("#quantity").val();          
              $("#supportSubmit").text(($("#actionType").val() == "remove") ? "Cancel Subscription" : "Buy Subscription");
              if (q>0 &amp;&amp; ( $("#actionType").val() == "add" || q &lt;= { $paid-tickets } )) {{
                $("#supportSubmit").removeAttr("disabled");                                           
                $("#formControl").removeClass("error");
                if ($("#actionType").val() == "remove")
                  if (q>1) $("#ticket-info").text("Cancelling the subscription for "+q+ " Tickets will reduce your cost by "+({ $myaccount-views:support-price }*q)+" USD per month.");
                  else $("#ticket-info").text("Cancelling one ticket reduces your monthly cost by { $myaccount-views:support-price } USD.");
                else 
                  if (q>1) $("#ticket-info").text(q+ " additional Tickets will cost "+({ $myaccount-views:support-price }*q)+" USD per month.");
                  else $("#ticket-info").text("1 additional Ticket will cost { $myaccount-views:support-price } USD per month.");             
              }}
              else {{
                $("#supportSubmit").attr("disabled","disabled");
                $("#formControl").addClass("error");
                $("#ticket-info").text("Ticket count not valid.");
              }}              
          }}
          
          $(updateTicket);
      </script>
      
                
      <h4>Do you need help right now?</h4>
      <a target="_blank" href="https://28msec.zendesk.com">Visit our support site</a>     
   </div>
 </div>
};

declare function myaccount-views:confirm-buy-support($account as schema-element(s:account), $support-tickets as element(s:support-ticket)* , $quantity as xs:integer, $actionType as xs:string, $recurly-billing-info as element())
{
    let $quantity-change :=
      if ($actionType eq "add") then $quantity else 0 - $quantity
    let $old-total := sum($support-tickets/@count)
    let $old-paid-tickets := xs:integer($support-tickets[@support]/@count)
    let $paid-tickets := $support-tickets[@support]/@count + $quantity-change
    return
<div class="content">
    <div class="pane-header">
         <h2>Support Tickets</h2>
         <div id="submenu"></div>
    </div>
    <div class="pane-content container">
         <table class="table table-striped table-bordered">
           <tr>            
             <th>Package(s)</th>
             <th>Support Tickets / Month</th>             
           </tr>
           {
             for $ticket in $support-tickets             
             return
               <tr>                 
                 <td>
                   { data($ticket/@name) }
                 </td>
                 <td>                   
                   { if ($ticket/@support) 
                     then data($ticket/@count) + $quantity-change
                     else data($ticket/@count)
                   }                   
                 </td>                 
               </tr>
           }          
           <tr class="success">
               <td><b>Total</b></td>
               <td><b>
                   { $old-total + $quantity-change }                    
                </b></td>
           </tr>
         </table>
         <p>Total cost for support will be { if ($old-paid-tickets gt 0) then ( xs:string($old-paid-tickets) || " * " ||  xs:string($myaccount-views:support-price) || " USD" || (if ($actionType eq "add") then " + " else " - ") ) else () }<b> { $quantity } *  { $myaccount-views:support-price } USD</b> = { $myaccount-views:support-price * $paid-tickets } USD per month.</p>
         <p>Your Credit Card type { data($recurly-billing-info/card_type) || " starting with number " || data($recurly-billing-info/first_six) || "**********" } is charged for monthly support ticket fees.</p>         
         <p>Use the <a href="/myaccount/show_billing">Billing Info</a> tab to update your billing information.</p>
   
        <form method="POST" action="/myaccount/confirm-support">
            <input type="hidden" name="quantity" value="{ $quantity }" />
            <input type="hidden" name="type" value="{ $actionType }" />
            <button class="btn btn-primary btn-once btn-large" type="submit">Confirm Transaction</button>&#160;
            <a href="/myaccount/show-support" class="btn btn-once btn-large">Cancel</a>
        </form>
    </div>
</div>
};