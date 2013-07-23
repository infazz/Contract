
/* 
Local Storage vars
*/
var sisyphus;
var pageFormSelector = 'form';
var saveInterval = 10; // seconds between auto-save. 0 = save on value change
var loadLocalStorage = false;


function initializePage() {
    /* EDContract and EDNav initialization now happens on DocusignIndex.js
    // Add values to EDContract pages and elements
    
    //EDContract.Construct();
    //EDCNav.Construct('#ExhibitNavigation', 1);
    //EDContract.JoinToNav();

    if (window.location.hash.length > 0) {
    EDContract.GoToPageHash(window.location.hash);
    EDCNav.GoToNavHash(window.location.hash);
    EDCNav.ActivateNavNum(4);
    } else {
    // New Exhibit first tab is services
    window.location.hash = "services";
    }
    */
    console.log('edhibit.cshtml construct element rules');

    EDContract.SetElementRules(EDContract.SelectElementByID("MembershipFee"), {
        minimum: 0
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("SetupFeeRegular"), {
        setupFor: ["ReputationManagement", "SocialMedia", "SEO", "ListingService", "TotalTransformation", "InstantImpact", "MaximumValue"],
        minimum: 0,
        errors: {
            setupFor: "This is a set-up fee for Services and Packages. At least one Service or Package is required.",
            dependancyFunc: "Set-up Price Error"
        }
    });
    EDContract.SetDependancyFunction(
        EDContract.SelectElementByID("SetupFeeRegular"),
        function () {
            console.log('input value');
            console.log(this.input.val());
            var min = 0,
                val = this.input.val(),
                setups = this.rules.setupFor,
                currElement;
            for (var i = 0; i < setups.length; i++) {
                currElement = EDContract.SelectElementByID(setups[i]);
                if (currElement.selected === true) {
                    min += currElement.rules.setupFee;
                    console.log('setup min: ' + min);
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
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("ListingService"), {
        minimum: 497,
        setupFee: 97,
        setupID: "SetupFeeRegular",
        errors: {
            setupID: "Set-up Fee Services required"
        }
    });
        EDContract.SetElementSecondaryRules(EDContract.SelectElementByID("ListingService"), {
            required: true
        });
    EDContract.SetElementRules(EDContract.SelectElementByID("PracticeVideo"), {
        minimum: 397
    });

    // packages
    EDContract.SetElementRules(EDContract.SelectElementByID("InstantImpact"), {
        minimum: 597,
        setupFee: 242,
        includedServices: ["ReputationManagement", "SocialMedia"],
        setupID: "SetupFeeRegular",
        errors: {
            includedServices: "Reputation Management and Social Media are included in this package.",
            setupID: "Set-up Fee Services required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("MaximumValue"), {
        minimum: 747,
        setupFee: 942,
        includedServices: ["ReputationManagement", "SocialMedia", "SEO", "InstantImpact"],
        setupID: "SetupFeeRegular",
        errors: {
            includedServices: "Reputation Management, Social Media and SEO are included in this package.",
            setupID: "Set-up Fee Services required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("TotalTransformation"), {
        minimum: 1239,
        setupFee: 4842,
        includedServices: ["ReputationManagement", "SocialMedia", "SEO", "CustomWeb", "InstantImpact", "MaximumValue"],
        setupID: "SetupFeeRegular",
        errors: {
            includedServices: "Reputation Management, Social Media, SEO, and Custom Website are included in this package.",
            setupID: "Set-up Fee Services required"
        }
    });

    // website
    EDContract.SetElementRules(EDContract.SelectElementByID("CustomWeb"), {
        minimum: 397,
        setupID: "CustomWebSetup",
        errors: {
            setupID: "Set-up Custom Web required"
        }
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("CustomWebSetup"), {
        minimum: 397,
        setupFor: "CustomWeb",
        errors: {
            setupFor: "Set-up only. Custom Website Solution required"
        }
    });

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
        setupFor: "PPCPackage",
        errors: {
            setupFor: "Patient Leads service required"
        }
    });
    /*
    EDContract.SetElementRules(EDContract.SelectElementByID("FirstName"), {
        required: true,
        minimumLength: 1
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("LastName"), {
        required: true,
        minimumLength: 1
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("Email"), {
        required: true,
        email: true
    });
    EDContract.SetElementRules(EDContract.SelectElementByID("Phone"), {
        required: true,
        phone: true
    });
    */
    EDContract.RefreshPage();
}

function checkLocalStorage() {
    if (checkLocalStorageForms($(pageFormSelector))) {
        if (!confirm('We see you have previously filled out form information here.  Would you like us to load it in for you?')) {
            removeLocalStorageForms($(pageFormSelector));
        }
    } else {
        removeLocalStorageForms($(pageFormSelector));
    }
    setTimeout(function () {
        // name: $('#ProspectID').val(),
        // name: window.location.pathname,
        // customKeyPrefix: $('#ProspectID').val(),
        $(pageFormSelector).sisyphus({
            name: window.location.pathname,
            timeout: saveInterval,
            autoRelease: false,
            onSave: function () {
                //console.log('Saved at: ' + new Date().getTime());
            },
            onRestore: function () {
                console.log('\n***\nrestore from localstorage\n***\n');
                EDContract.LoadAllElementsFromStorage();
            },
            excludeFields: [$('input[type="hidden"]')]
        });
    }, 500);
}

/*
Local storage / Sisyphus.js related functions
*/
function checkLocalStorageForms(form) {
    // check to see if the form has values saved && values are for current prospect ID
    var values = false,
        lsArray = [];

    console.log('local storage elements for ' + window.location.pathname + $(form).attr('id'));
    $('input,textarea,select', form).each(function (i, input) {
        
        if ($(input).attr('type') != 'submit' && $(input).attr('type') != 'hidden') {
            
            console.log("\n" + i + " " + $(input).attr('name') + ", type: " + $(input).attr('type'));
            console.log("Local Storage: " + sisyphus.browserStorage.get(window.location.pathname + $(form).attr('id') + $(input).attr('name')));
            console.log("DBase Storage: " + $(input).val());
            
            if (sisyphus.browserStorage.get(window.location.pathname + $(form).attr('id') + $(input).attr('name')) != $(input).val()) {
                console.log("  push: false");
                lsArray.push(false);
            } 
        }
        if (sisyphus.browserStorage.get(window.location.pathname + $(form).attr('id') + $(input).attr('name')) !== null) {
            if (sisyphus.browserStorage.get(window.location.pathname + "ProspectID") === $('#ProspectID').val()) {
                // Make sure the Prospect ID is the same in Local Storage
                //console.log('local storage prospectid: ' + sisyphus.browserStorage.get(window.location.pathname + "ProspectID"));
                //console.log('live prospectid: ' + $('#ProspectID').val());
                values = true;
                //return false
            }
        }
    });

    if (lsArray.indexOf(false) > -1 && values === true) {
        values = true;
    }

    return values;
}
function removeLocalStorageForms(form) {
    // check to see if the form has values saved
    $('input,textarea,select', form).each(function (i, input) {
        if (sisyphus.browserStorage.get(window.location.pathname + $(form).attr('id') + $(input).attr('name')) !== null) {
            // removes all stored data for the form
            sisyphus.browserStorage.remove(window.location.pathname + $(form).attr('id') + $(input).attr('name'));
        }
    });
}

$(document).ready(function () {

    //initializePage();
    /*if (loadLocalStorage) {
        // initiate Sisyphus - local storage object
        sisyphus = $.sisyphus();
        checkLocalStorage();
    }


    $('input, select').change(function () {
        sisyphus.saveAllData();
    });
    $('#ExhibitDetails .editor-label').click(function () {
        sisyphus.saveAllData();
    });*/

    // Use Signing Details Checkbox
    $("#chkCopyProfileInfo").click(function () {
        $("#secondPage_contractDetail_ContactFirstName").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactLastName").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactEmail").val('').removeAttr('readonly');
        $("#secondPage_contractDetail_ContactPhoneNumber").val('').removeAttr('readonly');

        if ($('#chkCopyProfileInfo').attr('checked')) {
            var valueOfFirstName = $('#firstpage_firstname').val();
            var valueOfLastName = $('#firstpage_lastname').val();
            var valueOfEmail = $('#firstpage_email').val();
            var valueOfPhone = $('#firstpage_phone').val();
            $("#secondPage_contractDetail_ContactFirstName").val(valueOfFirstName).attr('readonly', 'readonly');
            $("#secondPage_contractDetail_ContactLastName").val(valueOfLastName).attr('readonly', 'readonly');
            $("#secondPage_contractDetail_ContactEmail").val(valueOfEmail).attr('readonly', 'readonly');
            $("#secondPage_contractDetail_ContactPhoneNumber").val(valueOfPhone).attr('readonly', 'readonly');
        }

    });

    // Finish later handler
    $('.finish-later').click(function (e) {
        //sisyphus.saveAllData();
        return confirm("Are you sure you want to finish this record later? If yes, you can retrieve this record by checking the \"Sales-In Progress Page.\"");
    });
});

