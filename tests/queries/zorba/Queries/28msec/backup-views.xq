xquery version "3.0";
module namespace backup-views = "http://portal.28.io/views/backup-views";

import module namespace forms = "http://portal.28.io/util/forms";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare function backup-views:automatic() {
  <div class="content">
      <h2>Automatic Backups</h2>      
      <div id="success" style="display:none" class="successbox">
        <p>Configuration successfully changed</p>        
      </div>
      { forms:layout(
      <form class="form-horizontal">
        <legend>Setup automatic backups</legend>
        <fieldset>
        <x:row label="Enable"><label class="checkbox"><input name="enable" type="checkbox" />Enable automatic backups</label></x:row>
        <x:row label="Interval"><select name="interval"><option>Every 3 Hours</option><option selected="selected">Every Day</option><option>Every Week</option><option>Every Month</option></select></x:row>
        <x:row label="Keep Automatic Backups"><select name="long"><option>Forever</option><option>For 1 Year</option><option>For 3 month</option></select>          
        </x:row>
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onClick="$('#success').show();">Submit</button>
        </div>
        </fieldset>
      </form>
      ) }
  </div>
};

declare function backup-views:backup-list() {
  <div class="content">
      <h2>Backup / Restore</h2>
      <p>You can create backups of your project data.</p>
      <a href="#" class="btn btn-primary" onClick="$('#r1').show();">Create New Backup Now</a>&#160;
      <a href="/backup/show-automatic" class="btn">Setup Automatic Backups</a>
      <table class="table table-striped">
        <thead>
         <tr>
          <th>Backup</th>
          <th>Action</th>
         </tr>
        </thead>
        <tr>         
         <td>01.02.2012 08:30</td>
         <td><a class="btn" href="#">Restore</a>&#160;<a class="btn" href="#">Download</a>&#160;<a class="btn" href="#">Delete</a></td>
        </tr>
        <tr>         
         <td>01.03.2012 09:35</td>
         <td><a class="btn" href="#">Restore</a>&#160;<a class="btn" href="#">Download</a>&#160;<a class="btn" href="#">Delete</a></td>
        </tr>
        <tr>         
         <td>01.04.2012 08:33</td>
         <td><a class="btn" href="#">Restore</a>&#160;<a class="btn" href="#">Download</a>&#160;<a class="btn" href="#">Delete</a></td>
        </tr>
        <tr id="r1" style="display:none">         
         <td>today</td>
         <td><a class="btn" href="#">Restore</a>&#160;<a class="btn" href="#">Download</a>&#160;<a class="btn" href="#">Delete</a></td>
        </tr>
      </table>
    </div>
};