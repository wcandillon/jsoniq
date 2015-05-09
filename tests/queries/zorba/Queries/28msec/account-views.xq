xquery version "3.0";
module namespace av = "http://portal.28.io/views/account-views";

import module namespace req = "http://www.28msec.com/modules/http/request";

import module namespace forms = "http://portal.28.io/util/forms";
import module namespace config = "http://portal.28.io/util/config";

import schema namespace s = "http://28.io/schemas/portal";

import module namespace html5 = "http://portal.28.io/views/html5";

declare namespace x = "http://portal.28.io/util/forms";

declare variable $av:scheme := "https://";

declare function av:login-headers()
{
  <link href="{$html5:cdn}/css/login.css" rel="stylesheet" />
};

declare function av:login($parameters as object()) 
{
  <script type="text/javascript">{"
    $(document).ready(function() {
    
    $('#new-login').click(function() {
    
      $.ajax({
        type: 'POST',
        url: '/api/auth',
        data: 
        {
          grant_type: 'client_credentials',
          email: $('#email').val(),
          password: $('#password').val()
        },
        dataType: 'json'
      }).done(function(json)
          { 
            localStorage['project_tokens'] = JSON.stringify(json['project_tokens']);
            localStorage['access_token'] = JSON.stringify(json['access_token']);
            localStorage['refresh_token'] = JSON.stringify(json['refresh_token']);
            document.cookie = 'access_token=' + json['access_token'] + '; path=/';
            window.location.replace('" || $parameters("redirect_uri") || "');
          })
        .fail(function(json)
          {
            document.login.action = '/oauth2/login';
            document.login.submit();
          })
      });
     
    });
  "}
  </script>,
  <div id="dialog">
    <form name="login" id="login_form" class="modal open-anim dialog-form" action="javascript:void(0);">
      <fieldset class="modal-body">
        <div class="control-group">
          <label class="control-label" for="email">Email</label>
          <div class="controls">
            <input type="text" class="input-xlarge" name="email" id="email"/>
          </div>
        </div>
        <div class="control-group">
          <label class="control-label" for="password">Password</label>
            <div class="controls">
              <input type="password" class="input-xlarge" name="password" id="password"/>
            </div>
        </div>
        {
          for $key in jn:keys($parameters)
          where not($key = ("email","password"))
          return <input type="hidden" name="{$key}" id="{$key}" value="{$parameters($key)}" />
        }
      </fieldset>  
      <div class="modal-footer">
        <button class="btn btn-large btn-block btn-primary btn-once btn-close" id="new-login">Login</button>        
        <p><a href="/account/show-lostpassword">Forgot your password?</a></p>
        <a href="/account/show-register" class="btn btn-large btn-block btn-once btn-close" type="button">Sign Up</a>        
      </div>      
      </form>      
      
  </div>   
};

declare function av:register-account() 
{
  <div id="dialog">  
    { forms:layout(
      <form class="modal open-anim form-horizontal" method="POST" action="/account/register">
        <div class="modal-header">
          <h3>Registration</h3>
        </div>        
        <fieldset class="modal-body"> 
	  <div class="control-group">
	      <label class="control-label" for="firstname">First Name</label>
	      <div class="controls">
	         <input type="text" name="firstname" />
	      </div>
	  </div> 
	  <div class="control-group">
	      <label class="control-label" for="lastname">Last Name</label>
	      <div class="controls">
	         <input type="text" name="lastname" />
	      </div>
	  </div>
	  <div class="control-group">
	      <label class="control-label" for="email">Email</label>
	      <div class="controls">
	         <input type="text" name="email" value="{req:parameter-values('email')}" />
	      </div>
	  </div>
	  <div class="control-group">
	      <label class="control-label" for="company">Company</label>
	      <div class="controls">
	         <input type="text" name="company" />
	      </div>
	  </div>
	  <div class="control-group">
	      <label class="control-label" for="password">Password</label>
	      <div class="controls">
	         <input type="password" name="password" />
	      </div>
	  </div>
	  <div class="control-group">
	      <label class="control-label" for="repetition">Repeat Password</label>
	      <div class="controls">
	         <input type="password" name="repetition" />
	      </div>
	  </div>   
	  <div class="control-group">
              <label class="checkbox" style="padding-left: 200px"><input type="checkbox" name="acceptterms" value="true" checked="true" />I agree with the <a href="http://www.28.io/terms-of-use" target="_blank">terms of use</a></label>
	  </div> 
        </fieldset>
        <div class="modal-footer" style="position: relative; height: 85px;">
	   <div class="hcenter" style="width: 200px; position: absolute; left: 50%; margin-left: -100px;">
	   <button class="btn btn-primary btn-large btn-block btn-once btn-close" type="submit">Register</button>
	   <br /><a href="/account/show-login">I already have an account.</a>
	   </div>
        </div>
      </form>
      ) }
  </div> 
};



declare function av:registration-message($account as schema-element(s:account))
{
  <div id="dialog">
    <div class="modal open-anim">
      <div class="modal-body">
        <h2></h2>
        <p>We just sent you a welcome mail with an account activation link. Click on that link to continue.</p>
      </div>
    </div>
    <script type="text/javascript">
	{ "MunchkinHelper.associateLead( { Email: &quot;" || fn:replace(fn:data($account/s:email), '"', '\\"') || "&quot;, " || 
				  "FirstName: &quot;" || fn:replace(fn:data($account/s:firstname), '"', '\\"') || "&quot;, " ||
				  "LastName: &quot;" || fn:replace(fn:data($account/s:lastname), '"', '\\"') || "&quot;, " || 
				  "Company: &quot;" || fn:replace(fn:data($account/s:company), '"', '\\"') || "&quot;, " ||
				  "account28io: true });" }
    </script>
   </div>
};

declare function av:lost-password() 
{
  <div id="dialog">    
      { forms:layout(
        <form action="/account/lostpassword" method="POST" class="modal open-anim dialog-form">
          <div class="modal-header">
           <h3>Lost Password</h3>
          </div>
          <fieldset class="modal-body">
           <x:row label="EMail"><input type="text" name="email" size="30" /></x:row>                            
          </fieldset>
           <div class="modal-footer">
             <button class="btn btn-primary btn-large btn-block btn-once btn-close" type="submit">Reset Password</button>
             <p><a href="/account/show-register">Sign up for a free account</a></p>
          </div>
        </form>      
      ) }           
    </div>
};

declare function av:send-lost-password()
{
  <div class="dialog">
    <div class="modal open-anim">
      <div class="modal-body">
        <h2></h2>
        <p>If you entered an existing email address, we have sent you password reset instructions.</p>
      </div>
    </div>     
  </div>
};


declare function av:set-password($email as xs:string, $reset-token as xs:string) {
  <div class="dialog">    
      { forms:layout(
       <form action="/account/reset-password" method="POST" class="modal open-anim dialog-form">
        <legend class="modal-header">Password recovery</legend>
        <fieldset class="modal-body">
          <input type="hidden" name="resettoken" value="{$reset-token}" />
          <input type="hidden" name="email" value="{$email}" />
          <x:row label="EMail"><input type="text" disabled="disabled" value="{ $email }" /></x:row>
          <x:row label="Password"><input type="password" name="password" size="30" /></x:row>
          <x:row label="Repeat Password"><input type="password" name="repetition" size="30" /></x:row>
         </fieldset> 
        <div class="modal-footer">
          <button class="btn btn-primary btn-large btn-block btn-once btn-close" type="submit">Submit</button>
        </div>            
      </form>         
      ) }       
    </div>
};

declare function av:logout-info($account as schema-element(s:account)) {
 <div id="dialog">
   <div class="modal open-anim">
   <div class="modal-body">
   <h2>Thank you for trying out 28.io!</h2> 
   
   <p>To continue using this browser just come back or bookmark us!</p>
   <br/>
   <br/>
   </div>
   <div class="modal-footer">
     <a href="http://www.28.io" class="btn btn-primary btn-large btn-block btn-close">Back to homepage</a>
   </div>
   </div>
 </div>
};
