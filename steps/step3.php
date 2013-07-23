
<div class="content-box edc-page" id="Contact-Details">

<h2>Contact Details</h2>
        <div class="content-box">
            <div class="row">
                <div class="column edc-element required" id="CompanyName">
                    <div class="editor-label">
                        <label for="CompanyName_txt">Company Name *</label>
                    </div>
                    <div class="editor-field">
                        <input class="longname" id="CompanyName_txt" name="CompanyName.txt" type="text" value="" />  
                        <span class="field-validation-valid" data-valmsg-for="CompanyName.txt" data-valmsg-replace="true"></span>           
                    </div>
                </div>

                <div class="column edc-element" id="Website">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectWebsite">Website</label>
                    </div>
                    <div class="editor-field">
                        <input class="website" data-val="true" data-val-length="Website cannot be more than 200 characters" data-val-length-max="200" id="Website" name="Website" type="text" value="" />
                        <span class="field-validation-valid" data-valmsg-for="Website" data-valmsg-replace="true"></span>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="column edc-element required" id="FirstName">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectFirstName">First Name *</label>
                    </div>
                    <div class="editor-field">
                        <input class="name" data-type="text" id="firstPage_Prospectinfo_ProspectFirstName" name="firstPage.Prospectinfo.ProspectFirstName" type="text" value="" />   
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectFirstName" data-valmsg-replace="true"></span>                             
                    </div>
                </div>
                
                <div class="column edc-element required" id="LastName">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectLastName">Last Name *</label>
                    </div>
                    <div class="editor-field">
                        <input class="name" data-type="text" id="firstPage_Prospectinfo_ProspectLastName" name="firstPage.Prospectinfo.ProspectLastName" type="text" value="" />
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectLastName" data-valmsg-replace="true"></span>  
                    </div>
                </div>
            </div>
        </div>

        <div class="content-box">
                
            <div class="row">
                <div class="column edc-element required" id="Email">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectEmailAddress">Email *</label>
                    </div>
                    <div class="editor-field">
                        <input class="email" id="firstPage_Prospectinfo_ProspectEmailAddress" name="firstPage.Prospectinfo.ProspectEmailAddress" type="email" value="" />   
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectEmailAddress" data-valmsg-replace="true"></span>          
                    </div>
                </div>
                <div class="column edc-element required" id="Phone">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectPhone">Phone *</label>
                    </div>
                    <div class="editor-field">
                        <input class="phone" data-val="true" data-val-length="Phone Cannot be more than 15 numbers" data-val-length-max="15" data-val-regex="Valid Phone required" data-val-regex-pattern="^[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{3} [0-9]{3} [0-9]{4}|\([0-9]{3}\)[0-9]{3}-[0-9]{4}$" id="firstPage_Prospectinfo_ProspectPhone" name="firstPage.Prospectinfo.ProspectPhone" type="tel" value="" />
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectPhone" data-valmsg-replace="true"></span>
                    </div>
                </div>
                
            </div>

            <div class="row">
                <div class="column edc-element required" id="Address1">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectAddresses_0__Address1">Address 1 *</label>
                    </div>
                    <div class="editor-field">
                        <input class="address" data-val="true" data-val-length="The field Address1 must be a string with a maximum length of 250." data-val-length-max="250" id="firstPage_Prospectinfo_ProspectAddresses_0__Address1" name="firstPage.Prospectinfo.ProspectAddresses[0].Address1" type="text" value="" />    
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectAddresses[0].Address1" data-valmsg-replace="true"></span>        
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="column edc-element" id="Address2">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectAddresses_0__Address2">Address 2</label>
                    </div>
                    <div class="editor-field">
                        <input class="address" id="firstPage_Prospectinfo_ProspectAddresses_0__Address2" name="firstPage.Prospectinfo.ProspectAddresses[0].Address2" type="text" value="" />  
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectAddresses[0].Address2" data-valmsg-replace="true"></span>              
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="column edc-element required" id="Zip">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectAddresses_0__Zip">Zip *</label>
                    </div>
                    <div class="editor-field">
                        <input class="zip" data-val="true" data-val-length="The field Zip must be a string with a maximum length of 10." data-val-length-max="10" id="firstPage_Prospectinfo_ProspectAddresses_0__Zip" name="firstPage.Prospectinfo.ProspectAddresses[0].Zip" type="text" value="" />
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectAddresses[0].Zip" data-valmsg-replace="true"></span>
                    </div>
                </div>

                <div class="column edc-element required zip-search" id="City">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectAddresses_0__City">City *</label>
                    </div>

                    <div class="zip-messages">
                        <span>Enter a zip code to the left.</span>
                        
                        <a class="cancel-loading">Dismiss</a>
                    </div>
                    <div class="loader">
                
                        <img src="http://content.everydayhealth.com/everydaydoctors/images/pulse-loader.gif" alt="loading data"/> 

                        <span>Loading, please wait a moment...</span>
                        <a class="cancel-loading">Cancel</a>
                    </div>

                    <div class="editor-field">
                        <select id="CityAutocomplete"></select>
                        <input class="city" data-val="true" data-val-length="The field City must be a string with a maximum length of 50." data-val-length-max="50" id="firstPage_Prospectinfo_ProspectAddresses_0__City" name="firstPage.Prospectinfo.ProspectAddresses[0].City" type="text" value="" />   
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectAddresses[0].City" data-valmsg-replace="true"></span>             

                        <a id="OtherCity">Is your city not listed?</a>
                        <a id="ListCity" style="display:none;">Select your city from a list</a>
                    </div>
                </div>
                <div class="column edc-element required" id="State">
                    <div class="editor-label">
                        <label for="firstPage_Prospectinfo_ProspectAddresses_0__State">State *</label>
                    </div>
                    <div class="editor-field">
                        <select class="state" id="firstPage_Prospectinfo_ProspectAddresses_0__State" name="firstPage.Prospectinfo.ProspectAddresses[0].State"><option value="">--select--</option>
<option value="AK">AK - Alaska</option>
<option value="AL">AL - Alabama</option>
<option value="AR">AR - Arkansas</option>
<option value="AZ">AZ - Arizona</option>
<option value="CA">CA - California</option>
<option value="CO">CO - Colorado</option>
<option value="CT">CT - Connecticut</option>
<option value="DC">DC - District of Columbia</option>
<option value="DE">DE - Delaware</option>
<option value="FL">FL - Florida </option>
<option value="GA">GA - Georgia</option>
<option value="HI">HI - Hawaii</option>
<option value="IA">IA - Iowa</option>
<option value="ID">ID - Idaho</option>
<option value="IL">IL - Illinois</option>
<option value="IN">IN - Indiana</option>
<option value="KS">KS - Kansas</option>
<option value="KY">KY - Kentucky</option>
<option value="LA">LA - Louisiana</option>
<option value="MA">MA - Massachusetts</option>
<option value="MD">MD - Maryland</option>
<option value="ME">ME - Maine</option>
<option value="MI">MI - Michigan</option>
<option value="MN">MN - Minnesota</option>
<option value="MO">MO - Missouri</option>
<option value="MS">MS - Mississippi</option>
<option value="MT">MT - Montana</option>
<option value="NC">NC - North Carolina</option>
<option value="ND">ND - North Dakota</option>
<option value="NE">NE - Nebraska</option>
<option value="NH">NH - New Hampshire</option>
<option value="NJ">NJ - New Jersey</option>
<option value="NM">NM - New Mexico</option>
<option value="NV">NV - Nevada</option>
<option value="NY">NY - New York</option>
<option value="OH">OH - Ohio</option>
<option value="OK">OK - Oklahoma</option>
<option value="OR">OR - Oregon</option>
<option value="PA">PA - Pennsylvania</option>
<option value="RI">RI - Rhode Island</option>
<option value="SC">SC - South Carolina</option>
<option value="SD">SD - South Dakota</option>
<option value="TN">TN - Tennessee</option>
<option value="TX">TX - Texas</option>
<option value="UT">UT - Utah</option>
<option value="VA">VA - Virginia</option>
<option value="VT">VT - Vermont</option>
<option value="WA">WA - Washington</option>
<option value="WI">WI - Wisconsin </option>
<option value="WV">WV - West Virginia</option>
<option value="WY">WY - Wyoming</option>
</select>
                        <span class="field-validation-valid" data-valmsg-for="firstPage.Prospectinfo.ProspectAddresses[0].State" data-valmsg-replace="true"></span>
                    </div>
                </div>
            </div>
			
        </div>

		<a class="continue" href="#Payment-Details">Continue >></a>
</div>