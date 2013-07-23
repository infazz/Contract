var contactZip,
    productZip;


var prospectSelectors = "";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectFirstName,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectLastName,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectEmailAddress,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectPhone,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectAddresses_0__Address1,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectAddresses_0__Address2,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectAddresses_0__Zip,";
    prospectSelectors += "#CityAutocomplete,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectAddresses_0__City,";
    prospectSelectors += "#firstPage_Prospectinfo_ProspectAddresses_0__State";

function initializePage() {

    // Add values to EDContract pages and elements
    EDContract.Construct();
    EDCNav.Construct('#ExhibitNavigation', 0);
    EDContract.JoinToNav();

    // testing only
    EDContract.GoToPageHash(window.location.hash);
    EDCNav.GoToNavHash(window.location.hash);
    EDCNav.ActivateNavNum(1);

    // override index submit
    EDContract.pages[1].submitButton.unbind('click');
    EDContract.pages[1].submitButton.bind('click', function () {
        return EDContract.SubmitMultiplePages([1, 0]);
    });
    // Listings service hidden field
    //var $ListingServiceHidden = $('#secondPage_contractDetail_Site');

    // test controls as addon
    EDContract.PageAddonReference(EDContract.SelectPageByID("client-details"), "#controls");

    // defining services & packages page settings
    EDContract.SetPageProperty(EDContract.SelectPageByID("services"), 'onValidate', function () {
        var spArray = ["ReputationManagement", "SocialMedia", "SEO", "SEOPlus", "InstantImpact", "MaximumValue", "TotalTransformation", "CustomWeb", "WebTemplate"]
            spValidationArray = [],
            listingArray = ["InstantImpact", "MaximumValue", "TotalTransformation"];


        for (var i = 0; i < spArray.length; i++) {
            if (EDContract.IsElementSelected(EDContract.SelectElementByID(spArray[i]))) {
                spValidationArray[i] = true;
            } else {
                spValidationArray[i] = false;
            }
        }
        /*for (var i = 0; i < listingArray.length; i++) {
            if ( EDContract.IsElementSelected( EDContract.SelectElementByID(listingArray[i]) ) ) {
                listingArray[i] = true;
            } else {
                listingArray[i] = false;
            }
        }

        if (listingArray.indexOf(true) < 0) {
            $ListingServiceHidden.val('');
        }*/

        if (spValidationArray.indexOf(true) > -1) {
            EDContract.ClearPageError(EDContract.SelectPageByID("services"));
            return true;
        } else {
            EDContract.ShowPageError(EDContract.SelectPageByID("services"), 'You must select a package or service.');
            return false;
        }
    });

    EDContract.SetProperty(EDContract.SelectElementByID("Specialty"), 'onChange', function () {
        var self = EDContract.SelectElementByID("Specialty").input;
        /*
        if (self.val() == "Dermatology") {
            $('#SkinsightDirectory, #SkinsightDirectoryTitle').slideDown();
        } else {
            $('#SkinsightDirectory, #SkinsightDirectoryTitle').slideUp();
            // deselect skinsight packages
            EDContract.ToggleElement(EDContract.SelectElementByID("SkinsightSetup"), false);
            EDContract.ToggleElement(EDContract.SelectElementByID("SkinsightProfessional"), false);
            EDContract.ToggleElement(EDContract.SelectElementByID("SkinsightEnterprise"), false);
            EDContract.ToggleElement(EDContract.SelectElementByID("SkinsightUltimate"), false);
        }*/
    });

    EDContract.SetProperty(EDContract.SelectElementByID("Specialty"), 'onActivate', function () {
        /*var self = EDContract.SelectElementByID("Specialty").input;
        if (self.val() == "Dermatology") {
            $('#SkinsightDirectory, #SkinsightDirectoryTitle').slideDown();
        }*/
    });
    /***
        services and packages
    ***/
    
    EDContract.SetElementRules(EDContract.SelectElementByID("MembershipFee"), {
        minimum: 0
    });

    EDContract.SetElementRules(EDContract.SelectElementByID("SetupFeeRegular"), {
        serviceID: ["ReputationManagement", "SocialMedia", "SEO", "SEOPlus", "InstantImpact", "MaximumValue"],
        minimum: 0,
        errors: {
            serviceID: "This is a set-up fee for Services and Packages. At least one Service or Package is required.",
            dependancyFunc: "Set-up Price Error"
        }
    });
    EDContract.SetDependancyFunction( EDContract.SelectElementByID("SetupFeeRegular"),
        function () {
            var min = 0,
                val = this.input.val(),
                setups = this.rules.serviceID,
                currElement;
            for (var i = 0; i < setups.length; i++) {
                currElement = EDContract.SelectElementByID(setups[i]);
                if (currElement.selected === true) {
                    min += currElement.rules.setupFee;
                }
            }

            if (val >= min) {
                return true;
            }
            return false;
        }
    );
    
    EDContract.SetElementRules(EDContract.SelectElementByID("ReputationManagement"), {
        minimum: 127,
        setupFee: 97,
        setupID: "SetupFeeRegular",
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });
    
    EDContract.SetElementRules(EDContract.SelectElementByID("SocialMedia"), {
        minimum: 187,
        setupFee: 97,
        setupID: "SetupFeeRegular",
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });
    
    EDContract.SetElementRules(EDContract.SelectElementByID("SEO"), {
        minimum: 497,
        setupFee: 97,
        setupID: "SetupFeeRegular",
        radioGroup: ["SEOPlus"],
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });

    EDContract.SetElementRules(EDContract.SelectElementByID("SEOPlus"), {
        minimum: 757,
        setupFee: 197,
        setupID: "SetupFeeRegular",
        radioGroup: ["SEO"],
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });

    EDContract.SetElementRules(EDContract.SelectElementByID("SEO5"), {
        minimum: 500,
        locked: true,
        setupID: ["SEO", "SEOPlus"],
        radioGroup: ["SEO10"],
        errors: {
            setupID: "SEO or SEOPlus is required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("SEO10"), {
        minimum: 900,
        locked: true,
        setupID: ["SEO", "SEOPlus"],
        radioGroup: ["SEO5"],
        errors: {
            setupID: "SEO or SEOPlus is required"
        }
    });
    /*
    EDContract.SetElementRules(EDContract.SelectElementByID("ListingService"), {
        minimum: 395,
        setupFee: 97,
        setupID: "SetupFeeRegular",
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });
    EDContract.SetElementSecondaryRules(EDContract.SelectElementByID("ListingService"), {
        required: true
    });
    EDContract.SetDependancyFunction(EDContract.SelectElementByID("ListingService"),
        function () {
            if ($('#ListingServiceSite').val() != "--select--") {
                $ListingServiceHidden.val($('#ListingServiceSite').val());
            } else {
                $ListingServiceHidden.val('');
            }
        }
    );
    EDContract.SetProperty(EDContract.SelectElementByID("ListingService"), 'onActivate', function () {
        $('#ListingServiceSite').val($ListingServiceHidden.val());
    });*/

    /*EDContract.SetElementRules(EDContract.SelectElementByID("PracticeVideo"), {
        minimum: 397
    });*/

    // packages
    EDContract.SetElementRules(EDContract.SelectElementByID("InstantImpact"), {
        minimum: 597,
        setupFee: 242,
        includedServices: ["ListingService"],
        setupID: "SetupFeeRegular",
        radioGroup: ["MaximumValue", "TotalTransformation", "TotalTransformationSetup"],
        errors: {
            includedServices: "Listing Service is included in this package.",
            setupID: "Set-up Fee Services required"
        }
    });
    EDContract.SetDependancyFunction(EDContract.SelectElementByID("InstantImpact"),
        function () {
            if ($('#InstantImpactSite').val() != "--select--") {
                $ListingServiceHidden.val($('#InstantImpactSite').val());
            } else {
                $ListingServiceHidden.val('');
            }
        }
    );
        /*EDContract.SetProperty(EDContract.SelectElementByID("InstantImpact"), 'onActivate', function () {
            $('#InstantImpactSite').val($ListingServiceHidden.val());
        });*/

    EDContract.SetElementRules(EDContract.SelectElementByID("MaximumValue"), {
        minimum: 747,
        setupFee: 942,
        includedServices: ["ListingService", "SEO", "SEOPlus","InstantImpact"],
        setupID: "SetupFeeRegular",
        radioGroup: ["InstantImpact", "TotalTransformation", "TotalTransformationSetup"],
        errors: {
            includedServices: "SEO, SEO Plus, Listing Service, and Instant Impact are included in this package.",
            setupID: "Set-up Fee Services required"
        }
    });
    /*EDContract.SetDependancyFunction(EDContract.SelectElementByID("MaximumValue"),
        function () {
            if ($('#MaximumValueSite').val() != "--select--") {
                $ListingServiceHidden.val($('#MaximumValueSite').val());
            } else {
                $ListingServiceHidden.val('');
            }
        }
    );
        EDContract.SetProperty(EDContract.SelectElementByID("MaximumValue"), 'onActivate', function () {
            $('#MaximumValueSite').val($ListingServiceHidden.val());
        });*/
    
    // total transformation
    EDContract.SetElementRules(EDContract.SelectElementByID("TotalTransformationSetup"), {
        minimum: 4842,
        radioGroup: ["InstantImpact", "MaximumValue"],
        serviceID: "TotalTransformation",
        errors: {
            serviceID: "Set-up only. Total Transformation required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("TotalTransformation"), {
        minimum: 1239,
        includedServices: ["SEO", "SEOPlus", "ListingService", "CustomWeb", "CustomWebSetup", "InstantImpact", "MaximumValue"],
        setupID: "TotalTransformationSetup",
        radioGroup: ["InstantImpact", "MaximumValue"],
        errors: {
            includedServices: "SEO, SEO Plus, Listing Service, Custom Website, Instant Impact and Maximum Value are included in this package.",
            setupID: "Total Transformation Set-up required"
        }
    });
    /*EDContract.SetDependancyFunction(EDContract.SelectElementByID("TotalTransformation"),
        function () {
            if ($('#TotalTransformationSite').val() != "--select--") {
                $ListingServiceHidden.val($('#TotalTransformationSite').val());
            } else {
                $ListingServiceHidden.val('');
            }
        }
    );
        EDContract.SetProperty(EDContract.SelectElementByID("TotalTransformation"), 'onActivate', function () {
            $('#TotalTransformationSite').val($ListingServiceHidden.val());
        });
        EDContract.SetProperty(EDContract.SelectElementByID("TotalTransformation"), 'onDeselect', function () {
            EDContract.ToggleElement(EDContract.SelectElementByID("TotalTransformationSetup"), false);
        });*/

    // website
    EDContract.SetElementRules(EDContract.SelectElementByID("CustomWeb"), {
        minimum: 492,
        setupID: "CustomWebSetup",
        errors: {
            setupID: "Set-up Custom Web required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("CustomWebSetup"), {
        minimum: 3900,
        serviceID: "CustomWeb",
        errors: {
            serviceID: "Set-up only. Custom Website Solution required"
        }
    });

    // website template
    EDContract.SetElementRules(EDContract.SelectElementByID("WebTemplate"), {
        minimum: 225,
        setupID: "WebTemplateSetup",
        errors: {
            setupID: "Set-up Website Template required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("WebTemplateSetup"), {
        minimum: 1275,
        serviceID: "WebTemplate",
        errors: {
            serviceID: "Set-up only. Website Template Solution required"
        }
    });

    /*
    // ppc
    EDContract.SetElementRules(EDContract.SelectElementByID("PPCPackage"), {
        minimum: 950,
        setupID: "PPCSetup",
        errors: {
            setupID: "Set-up PPC required"
        }
    });
    EDContract.SetProperty(EDContract.SelectElementByID("PPCPackage"), 'onChange', function () {
        var self = EDContract.SelectElementByID("PPCPackage").input;
        if (parseInt(self.val(), 10) >= 8000) {
            $('#HiddenPPC').show();
        } else {
            $('#HiddenPPC').hide();
        }
    });
    EDContract.SetProperty(EDContract.SelectElementByID("PPCPackage"), 'onActivate', function () {
        var self = EDContract.SelectElementByID("PPCPackage").input;
        if (parseInt(self.val(), 10) >= 8000) {
            $('#HiddenPPC').show();
        } else {
            $('#HiddenPPC').hide();
        }
    });

    EDContract.SetElementRules(EDContract.SelectElementByID("PPCSetup"), {
        minimum: 300,
        serviceID: "PPCPackage",
        errors: {
            serviceID: "Patient Leads service required"
        }
    });
    */

    // signing details
    EDContract.SetElementRules(EDContract.SelectElementByID("Zip"), {
        required: true,
        minimumLength: 5
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("ProductZip"), {
        required: true,
        minimumLength: 5
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("Phone"), {
        required: true,
        phone: true
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("ProductPhone"), {
        required: true,
        phone: true
    });


    // re-activate page
    // this fixes a bug where added functions in this file are not run
    EDContract.RefreshPage();
}


function copyDetails() {
    var valueOfFirstName = $('#firstPage_Prospectinfo_ProspectFirstName').val();
    var valueOfLastName = $('#firstPage_Prospectinfo_ProspectLastName').val();
    var valueOfEmail = $('#firstPage_Prospectinfo_ProspectEmailAddress').val();
    var valueOfPhone = $('#firstPage_Prospectinfo_ProspectPhone').val();

    var valueOfAddress1 = $('#firstPage_Prospectinfo_ProspectAddresses_0__Address1').val();
    var valueOfAddress2 = $('#firstPage_Prospectinfo_ProspectAddresses_0__Address2').val();
    var valueOfZip = $('#firstPage_Prospectinfo_ProspectAddresses_0__Zip').val();
    //var valueOfCityDD = $('#CityAutocomplete').val();
    var valueOfCity = $('#firstPage_Prospectinfo_ProspectAddresses_0__City').val();
    var valueOfState = $('#firstPage_Prospectinfo_ProspectAddresses_0__State').val();

    // use before copying since this function also clears the city texbox
    productZip.ShowCityTextbox();
    productZip.DeactivateControls();

    $("#secondPage_contractDetail_ContactFirstName").val(valueOfFirstName).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactLastName").val(valueOfLastName).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactEmail").val(valueOfEmail).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactPhoneNumber").val(valueOfPhone).attr('readonly', 'readonly');

    $("#secondPage_contractDetail_ContactAddress1").val(valueOfAddress1).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactAddress2").val(valueOfAddress2).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactZip").val(valueOfZip).attr('readonly', 'readonly');
    //$("#ProductCityAutocomplete").val(valueOfCityDD).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactCity").val(valueOfCity).attr('readonly', 'readonly');
    $("#secondPage_contractDetail_ContactState").val(valueOfState).attr('readonly', 'readonly');
}

function enableCopy() {

    copyDetails();

    $(prospectSelectors).bind('change', function () {
        copyDetails();
    });
    
}

function disableCopy() {

    $(prospectSelectors).unbind('change');
}

$(document).ready(function () {

    $('#SkinsightDirectory').hide();
    $('#SkinsightDirectoryTitle').hide();

    initializePage();

    contactZip = new ZipSearch();
    contactZip.init({
        loaderSelector: '#City .loader',
        cancelSelector: '#City .cancel-loading',
        messageSelector: '#City .zip-messages',
        zipSelector: '#firstPage_Prospectinfo_ProspectAddresses_0__Zip',
        cityTextboxSelector: '#firstPage_Prospectinfo_ProspectAddresses_0__City',
        cityDropdownSelector: '#CityAutocomplete',
        otherCitySelector: '#OtherCity',
        listCitySelector: '#ListCity',
        stateSelector: '#firstPage_Prospectinfo_ProspectAddresses_0__State'
    });

    productZip = new ZipSearch();
    productZip.init({
        loaderSelector: '#ProductCity .loader',
        cancelSelector: '#ProductCity .cancel-loading',
        messageSelector: '#ProductCity .zip-messages',
        zipSelector: '#secondPage_contractDetail_ContactZip',
        cityTextboxSelector: '#secondPage_contractDetail_ContactCity',
        cityDropdownSelector: '#ProductCityAutocomplete',
        otherCitySelector: '#ProductOtherCity',
        listCitySelector: '#ProductListCity',
        stateSelector: '#secondPage_contractDetail_ContactState'
    });


    // Use Signing Details Checkbox
    $("#chkCopyProfileInfo").click(function () {
        $("#secondPage_contractDetail_ContactFirstName").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactLastName").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactEmail").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactPhoneNumber").val('').removeAttr('readonly');

        $("#secondPage_contractDetail_ContactAddress1").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactAddress2").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactZip").val('').removeAttr('readonly');
        //$("#ProductCityAutocomplete").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactCity").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactState").val('').removeAttr('readonly');

        productZip.ActivateControls();

        if ($('#chkCopyProfileInfo').attr('checked')) {
            enableCopy();
        } else {
            disableCopy();
        }

    });

    if ($('#chkCopyProfileInfo').attr('checked')) {

        enableCopy();
    }

    // Finish later handler
    $('.finish-later').click(function () {
        var valueOfPracticename = $('#firstPage_Prospectinfo_ProspectPracticeName').val(),
            valueOfFirstName = $('#firstPage_Prospectinfo_ProspectFirstName').val(),
            valueOfLastName = $('#firstPage_Prospectinfo_ProspectLastName').val();

        if (valueOfPracticename.length > 0 || (valueOfFirstName.length > 0 && valueOfLastName.length > 0 )) {
            return confirm("Are you sure you want to finish this record later? If yes, you can retrieve this record by checking the \"Sales-In Progress Page.\"");
        } else {
            EDContract.ValidateElement(EDContract.SelectElementByID("PracticeName"));
            EDContract.ValidateElement(EDContract.SelectElementByID("FirstName"));
            EDContract.ValidateElement(EDContract.SelectElementByID("LastName"));
            alert("Practice name or first and last name required in order to finish later.");
            return false;
        }
    });
});