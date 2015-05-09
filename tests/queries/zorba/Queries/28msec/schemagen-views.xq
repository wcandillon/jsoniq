xquery version "3.0";
module namespace schemagen-views = "http://portal.28.io/views/schemagen-views";

import module namespace forms = "http://portal.28.io/util/forms";

declare namespace x = "http://portal.28.io/util/forms";

import schema namespace s = "http://28.io/schemas/portal";

declare function schemagen-views:generate-schema() {
  <div class="content">
      <h2>Generate schema out of data</h2>      
      <p>You can generate a schema for data already stored in the database.</p>
      { forms:layout(
      <form class="form-horizontal">      
        <fieldset>
          <x:row label="Schema Namespace"><input type="text" name="namespace" size="30" /></x:row>
          <x:row label="Default Prefix"><input type="text" name="prefix" size="30" /></x:row>
        </fieldset>
       <div class="alert alert-info">This is a list of collections without a schema. Select the collections you want to generate a schema for:</div>
       <table class="table table-striped" width="100%" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
           <th width="30">-</th>     
           <th>Name</th>                 
          </tr>
        </thead>
        <tr>
          <td><input type="checkbox" name="collections" value="1" checked="checked"/></td>
          <td><a href="/browser/browse">Collection 1</a></td>                    
        </tr>
        <tr>
          <td><input type="checkbox" name="collections" value="2" checked="checked"/></td>
          <td><a href="/browser/browse">Collection 2</a></td>                    
        </tr>
      </table>   
        <div class="form-actions">
          <a class="btn btn-primary" href="/schemagen/generate-schema">Generate Now</a>&#160;
          <button class="btn" type="button">Select All</button>&#160;
          <button class="btn" type="button">Deselect All</button>
        </div>
      </form> 
      ) }      
  </div>
};

declare function schemagen-views:generate-result() {
<div class="content">     
      <h2>Generate schema out of data - Step 2</h2>      
      <p>Your Schema has been generated.</p>
      <a class="btn" href="#">Download to Local PC</a>&#160;
      <a class="btn btn-primary" href="/data/schemas">Add to Project and Apply</a>
      <p/>
      <p>Preview:</p>
<pre class="pre-scrollable prettyprint">
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;xs:schema targetNamespace="http://www.evaluescience.com/schemas/schema"
  xmlns = "http://www.evaluescience.com/schemas/schema"
  xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified"&gt;
             
  &lt;xs:element name="test"&gt;
    &lt;xs:complexType&gt;
      &lt;xs:attribute name="attr" type="xs:string" /&gt;
      &lt;xs:attribute name="attr2" type="xs:string" /&gt;
    &lt;/xs:complexType&gt;
  &lt;/xs:element&gt;
          
  &lt;xs:complexType name="Schedule"&gt;
      &lt;xs:sequence&gt;
          &lt;xs:element name="alternative" type="xs:string" maxOccurs="unbounded" minOccurs="0"&gt;&lt;/xs:element&gt;
      &lt;/xs:sequence&gt;
      &lt;xs:attribute name="process" type="xs:string"&gt;&lt;/xs:attribute&gt;
      &lt;xs:attribute name="instance" type="xs:string" use="optional"&gt;&lt;/xs:attribute&gt;
      &lt;xs:attribute name="status" type="xs:string" use="optional"&gt;&lt;/xs:attribute&gt;
      &lt;xs:attribute name="started" type="xs:dateTime"
          use="optional"&gt;
      &lt;/xs:attribute&gt;
      &lt;xs:attribute name="ended" type="xs:dateTime" use="optional"&gt;&lt;/xs:attribute&gt;
  &lt;/xs:complexType&gt;
&lt;/xs:schema&gt;
</pre>
    </div>
};