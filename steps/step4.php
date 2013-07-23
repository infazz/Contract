
	<div class="content-box edc-page" id="Payment-Details">
			<div class="content-box">
                <h2>Primary Billing Method</h2>
                <div class="cc-type">
                    <select id="thirdPage_PrimaryCC_CCType" name="thirdPage.PrimaryCC.CCType"><option value="">--select--</option>
						<option value="Visa">Visa</option>
						<option value="MasterCard">MasterCard</option>
						<option value="American Express">American Express</option>
						<option value="Discover">Discover</option>
					</select>
                    <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.CCType" data-valmsg-replace="true"></span>
                </div>
                <div class="row edc-element required" id="CCName">
                    <div class="editor-label">
                        <label for="thirdPage_PrimaryCC_HolderName">Name on Card *</label>
                    </div>
                    <div class="editor-field">
                        <input class="longname" data-val="true" data-val-length="The field Name on Card must be a string with a maximum length of 100." data-val-length-max="100" data-val-required="Name on Card is required" id="thirdPage_PrimaryCC_HolderName" name="thirdPage.PrimaryCC.HolderName" type="text" value="" />
                        <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.HolderName" data-valmsg-replace="true"></span>
                    </div>
                </div>
                
                <div class="row edc-element required" id="CCNumber">
                    <div class="column">
                        <div class="editor-label">
                            <label for="thirdPage_PrimaryCC_CardNumber">Credit Card Number *</label>
                        </div>
                        <div class="editor-field">
                            <div class="column">
                            <input id="thirdPage_PrimaryCC_CardNumber" name="thirdPage.PrimaryCC.CardNumber" pattern="[0-9]*" type="text" value="" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.CardNumber" data-valmsg-replace="true"></span>
                            </div>
                            <ul class="card-type" id="PrimaryCardType">
                                <li class="icon amex-dull"></li>
                                <li class="icon mc-dull"></li>
                                <li class="icon visa-dull"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="column">
                    </div>
                </div>
            
                <div class="row expiration">
                    <div class="column edc-element required" id="CCExp">
                        <div class="editor-label">
                            <label>Expiration ( MM / YYYY ) *</label>
                        </div>
                        <div class="editor-field">
                            <input data-val="true" data-val-number="The field Expiration Month must be a number." data-val-range="Invalid Expiration Month" data-val-range-max="12" data-val-range-min="1" data-val-required="Expiration Month is required" id="thirdPage_PrimaryCC_ExpirationMonth" name="thirdPage.PrimaryCC.ExpirationMonth" pattern="[0-9]*" type="text" value="0" />
                            <span>/</span>
                            <input data-val="true" data-val-number="The field Expiration Year must be a number." data-val-range="Invalid Expiration Year" data-val-range-max="9999" data-val-range-min="2012" data-val-required="Expiration Year is required" id="thirdPage_PrimaryCC_ExpirationYear" name="thirdPage.PrimaryCC.ExpirationYear" pattern="[0-9]*" type="text" value="0" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.ExpirationMonth" data-valmsg-replace="true"></span>
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.ExpirationYear" data-valmsg-replace="true"></span>
                        </div>
                    </div>
                    <div class="column edc-element required" id="CVV">
                        <div class="editor-label">
                            <label for="thirdPage_PrimaryCC_CVV">CVV *</label>
                        </div>
                        <div class="editor-field">
                            <input id="thirdPage_PrimaryCC_CVV" name="thirdPage.PrimaryCC.CVV" pattern="[0-9]*" type="text" value="" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.CVV" data-valmsg-replace="true"></span>
                        </div>
                    </div>
                </div>
                                  
                 

                 
                <div class="row edc-element required" id="Address1">
                    <div class="editor-label">
                        <label for="thirdPage_PrimaryCC_Address_Address1">Address 1 *</label>
                    </div>
                    <div class="editor-field">
                        <input class="address" data-val="true" data-val-length="The field Address1 must be a string with a maximum length of 250." data-val-length-max="250" id="thirdPage_PrimaryCC_Address_Address1" name="thirdPage.PrimaryCC.Address.Address1" type="text" value="" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.Address.Address1" data-valmsg-replace="true"></span>
                    </div>
                </div>
                <div class="row" id="Address2">
                    <div class="editor-label">
                        <label for="thirdPage_PrimaryCC_Address_Address2">Address 2</label>
                    </div>
                    <div class="editor-field">
                        <input class="address" id="thirdPage_PrimaryCC_Address_Address2" name="thirdPage.PrimaryCC.Address.Address2" type="text" value="" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.Address.Address2" data-valmsg-replace="true"></span>
                    </div>
                </div>
                
                
                
                <div class="row">
                    <div class="column edc-element required" id="CCZip">
                        <div class="editor-label">
                            <label for="thirdPage_PrimaryCC_Address_Zip">Zip *</label>
                        </div>
                        <div class="editor-field">
                            <input class="zip" data-val="true" data-val-length="The field Zip must be a string with a maximum length of 10." data-val-length-max="10" id="thirdPage_PrimaryCC_Address_Zip" name="thirdPage.PrimaryCC.Address.Zip" type="text" value="" />
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.Address.Zip" data-valmsg-replace="true"></span>
                        </div>
                    </div>

                    <div class="column edc-element required zip-search" id="CCCity">
                        <div class="editor-label">
                            <label for="thirdPage_PrimaryCC_Address_City">City *</label>
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
                            <select id="CCCityAutocomplete"></select>
                            <input class="city" data-val="true" data-val-length="The field City must be a string with a maximum length of 50." data-val-length-max="50" id="thirdPage_PrimaryCC_Address_City" name="thirdPage.PrimaryCC.Address.City" type="text" value="" />   
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.Address.City" data-valmsg-replace="true"></span>             

                            <a id="CCOtherCity">Is your city not listed?</a>
                            <a id="CCListCity" style="display:none;">Select your city from a list</a>
                        </div>
                    </div>
                    <div class="column edc-element required" id="CCState">
                        <div class="editor-label">
                            <label for="thirdPage_PrimaryCC_Address_State">State *</label>
                        </div>
                        <div class="editor-field">
                            <select class="state" id="thirdPage_PrimaryCC_Address_State" name="thirdPage.PrimaryCC.Address.State"><option value="">--select--</option>
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
                            <span class="field-validation-valid" data-valmsg-for="thirdPage.PrimaryCC.Address.State" data-valmsg-replace="true"></span>
                        </div>
                    </div>
                </div>
				
			</div>

			<a class="continue" href="#Finish">Continue >></a>
</div>