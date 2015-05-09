xquery version "3.0";
module namespace config-views = "http://portal.28.io/views/config-views";

import module namespace forms = "http://portal.28.io/util/forms";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare function config-views:setup() {
  <div class="content">
    <h2>Initial Setup</h2>
    { forms:layout(
       <form class="form-horizontal" action="/start/save-setup">        
           <legend>Setup</legend>
            <fieldset>
           <x:row label="Portal Type"><select class="input-xlarge" name="coresdk"><option value="false">Cloud</option><option value="true">Core SDK</option></select></x:row>
           <x:row label="Sausalito Home"><input type="text" class="input-xlarge" name="sausalito-home" /></x:row>
           <x:row label="Workspace Directory"><input type="text" class="input-xlarge" name="workspace" /></x:row>
           <x:row label="Application Domain (Appserver&#160;only)"><input type="text" class="input-xlarge" name="application-domain" value=""/></x:row>
           <x:row label="Portal Domain (Appserver&#160;only)"><input type="text" class="input-xlarge" name="portal-domain" value=""/></x:row>
           <x:row label="Appserver property file (Appserver&#160;only)"><input type="text" class="input-xlarge" name="appserver-property-file" value=""/></x:row>
           <x:row label="VHosts-Path (Appserver&#160;only)"><input type="text" class="input-xlarge" name="vhosts-path" value=""/></x:row>
           <x:row label="VHosts-Fcgi-Path (Appserver&#160;only)"><input type="text" class="input-xlarge" name="vhosts-fcgi-path" value=""/></x:row>
           <x:row label="Current Release (Appserver&#160;only)"><input type="text" class="input-xlarge" name="current-release"/></x:row>
           <x:row label="Temp-Dir (Appserver&#160;only)"><input type="text" class="input-xlarge" name="temp-dir"/></x:row>
           
           <x:row label="EMail Host (Appserver&#160;only)"><input type="text" class="input-xlarge" name="email-host" /></x:row>
           <x:row label="EMail User (Appserver&#160;only)"><input type="text" class="input-xlarge" name="email-user" /></x:row>
           <x:row label="EMail Senderaddress (Appserver&#160;only)"><input type="text" class="input-xlarge" name="email-sender-email" /></x:row>
           <x:row label="EMail Sendername (Appserver&#160;only)"><input type="text" class="input-xlarge" name="email-sender-name" /></x:row>
           <x:row label="EMail Password (Appserver&#160;only)"><input type="password" class="input-xlarge" name="email-password" /></x:row>
           <x:row label="Error Mails"><label class="checkbox"><input name="send-errors" type="checkbox" value="true"/>Send error reports</label></x:row>
           <x:row label="Event Mails"><label class="checkbox"><input name="send-events" type="checkbox" value="true"/>Send event reports</label></x:row>
           
           <div class="form-actions">
             <button class="btn btn-primary" type="submit">Save</button>
           </div>
        </fieldset>
       </form>
      ) }           
  </div>
};
