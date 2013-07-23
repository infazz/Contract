var app = app || {},
	EDContract = EDContract || {},
	EDCNav = EDCNav || {},
	$ListingServiceHidden = $('#Site');

(function($) {

	app.Functions = function () { };
	
	app.Functions.prototype = {
		
		init: function() {
			
			this.setupPages();
			
		},
		
		setupPages: function() {
			
			// Add values to EDContract pages and elements
		    EDContract.Construct();
		    EDCNav.Construct('.breadcrumbs', 0);
		    EDContract.JoinToNav();
			
			// clear hash
			window.location.hash = "";
		    EDCNav.ActivateNavNum(2);
			
		    // override index submit
		    EDContract.pages[2].submitButton.unbind('click');
		    EDContract.pages[2].submitButton.bind('click', function () {
		        return EDContract.SubmitMultiplePages([2, 1, 0]);
		    });
			
			this.setupServices();
			this.setupWebsites();
			this.setupClientDetails();
			this.setupPaymentDetails();
			
			EDContract.RefreshPage();
		},
		
		setupServices: function() {
			
			// Step1 Page Validations
		    EDContract.SetPageProperty(EDContract.SelectPageByID("Services-Packages"), 'onValidate', function () {
		        var spArray = ["RM","SM","SEO","SEOPlus","ListingService", "SocialPackage", "CompletePackage"],
		            spValidationArray = [],
		            listingArray = ["ListingService", "SocialPackage", "CompletePackage"];


		        for (var i = 0; i < spArray.length; i++) {
		            if (EDContract.IsElementSelected(EDContract.SelectElementByID(spArray[i]))) {
		                spValidationArray[i] = true;
		            } else {
		                spValidationArray[i] = false;
		            }
		        }
		        for (var i = 0; i < listingArray.length; i++) {
		            if ( EDContract.IsElementSelected( EDContract.SelectElementByID(listingArray[i]) ) ) {
		                listingArray[i] = true;
		            } else {
		                listingArray[i] = false;
		            }
		        }

		        if (listingArray.indexOf(true) < 0) {
		            $ListingServiceHidden.val('');
		        }

		        if (spValidationArray.indexOf(true) > -1) {
		            EDContract.ClearPageError(EDContract.SelectPageByID("Services-Packages"));
		            return true;
		        } else {
		            EDContract.ShowPageError(EDContract.SelectPageByID("Services-Packages"), 'You must select a package or service.');
		            return false;
		        }
		    });


		    EDContract.SetElementRules(EDContract.SelectElementByID("SetupFeeRegular"), {
		        serviceID: ["RM", "SM", "SEO", "SEOPlus", "ListingService", "SocialPackage", "CompletePackage"],
		        minimum: 0,
		        errors: {
		            serviceID: "This is a set-up fee for Services and Packages. At least one Service or Package is required.",
		            dependancyFunc: "Set-up Price Error"
		        }
		    });

			EDContract.SetElementRules(EDContract.SelectElementByID("RM"), {
		        minimum: 499,
				setupID: "SetupFeeRegular",
				errors: {
					setupID: "\"Set-up Fee Services\" required for this service."
				}
		    });

			EDContract.SetElementRules(EDContract.SelectElementByID("SM"), {
		        minimum: 499,
				setupID: "SetupFeeRegular"
		    });

			EDContract.SetElementRules(EDContract.SelectElementByID("SEO"), {
		        minimum: 499,
				setupID: "SetupFeeRegular"
		    });

			EDContract.SetElementRules(EDContract.SelectElementByID("SEOPlus"), {
		        minimum: 499,
				setupID: "SetupFeeRegular",
				includedServices: ["RM", "SEO"],
		        radioGroup: ["SEO"],
				errors: {
					includedServices: "SEO Plus includes Reputation Managment / Directory Listings and SEO"
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

			EDContract.SetElementSecondaryRules(EDContract.SelectElementByID("ListingService"), {
		        required: true,
				setupID: "SetupFeeRegular"
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
		    });


			EDContract.SetElementRules(EDContract.SelectElementByID("SocialPackage"), {
		        minimum: 597,
		        setupFee: 242,
		        includedServices: ["RM", "SM"],
		        setupID: "SetupFeeRegular",
		        radioGroup: ["CompletePackage"],
		        errors: {
		            includedServices: "Reputation Management and Social Media are included in this package.",
		            setupID: "Set-up Fee Services required"
		        }
		    });
		    EDContract.SetDependancyFunction(EDContract.SelectElementByID("SocialPackage"),
		        function () {
		            if ($('#SocialPackageSite').val() != "--select--") {
		                $ListingServiceHidden.val($('#SocialPackageSite').val());
		            } else {
		                $ListingServiceHidden.val('');
		            }
		        }
		    );
		        EDContract.SetProperty(EDContract.SelectElementByID("SocialPackage"), 'onActivate', function () {
		            $('#SocialPackageSite').val($ListingServiceHidden.val());
		        });


			EDContract.SetElementRules(EDContract.SelectElementByID("CompletePackage"), {
		        minimum: 597,
		        setupFee: 242,
		        includedServices: ["RM", "SM", "SEO", "SEOPlus", "ListingService"],
		        setupID: "SetupFeeRegular",
		        radioGroup: ["SocialPackage"],
		        errors: {
		            includedServices: "Reputation Mangement, Social Media, SEO, SEO Plus and Listing Service are included in this package.",
		            setupID: "Set-up Fee Services required"
		        }
		    });
		    EDContract.SetDependancyFunction(EDContract.SelectElementByID("CompletePackage"),
		        function () {
		            if ($('#CompletePackageSite').val() != "--select--") {
		                $ListingServiceHidden.val($('#CompletePackageSite').val());
		            } else {
		                $ListingServiceHidden.val('');
		            }
		        }
		    );
		        EDContract.SetProperty(EDContract.SelectElementByID("CompletePackage"), 'onActivate', function () {
		            $('#CompletePackageSite').val($ListingServiceHidden.val());
		        });
		},

		setupWebsites: function() {
			
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
			
		},
		
		setupClientDetails: function() {
			
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
		
		},
		
		setupPaymentDetails: function() {
			
			cc1 = $("#thirdPage_PrimaryCC_CardNumber");
		    ccM = $("#thirdPage_PrimaryCC_ExpirationMonth");
		    ccY = $("#thirdPage_PrimaryCC_ExpirationYear");
		    cvv = $("#thirdPage_PrimaryCC_CVV");
		    cc1.val('');
		    ccM.val('');
		    ccY.val('');
		    cvv.val('');
		    cc1.bind('load keyup keydown blur change', function () {
		        primaryCardEvent();
		    });

		    EDContract.SetElementRules(EDContract.SelectElementByID("CVV"), {
		        errors: {
		            dependancyFunc: ""
		        }
		    });

		    EDContract.SetDependancyFunction(EDContract.SelectElementByID("CVV"), function () {
		        var cvvElement = EDContract.SelectElementByID("CVV");
		        if ($('#thirdPage_PrimaryCC_CCType').val() == "American Express") {
		            if (cvv.val().length != 4) {
		                EDContract.ShowFieldError(cvvElement, cvvElement.input, 'CVV must be 4 digits');
		                return false;
		            }
		        } else {
		            if (cvv.val().length != 3) {
		                EDContract.ShowFieldError(cvvElement, cvvElement.input, 'CVV must be 3 digits');
		                return false;
		            }
		        }
		        EDContract.ClearFieldError(cvvElement, cvvElement.input);
		        return true;
		    });
		
			var ccZip = new ZipSearch();

			ccZip.init({
		        loaderSelector: '#CCCity .loader',
		        cancelSelector: '#CCCity .cancel-loading',
		        messageSelector: '#CCCity .zip-messages',
		        zipSelector: '#thirdPage_PrimaryCC_Address_Zip',
		        cityTextboxSelector: '#thirdPage_PrimaryCC_Address_City',
		        cityDropdownSelector: '#CCCityAutocomplete',
		        otherCitySelector: '#CCOtherCity',
		        listCitySelector: '#CCListCity',
		        stateSelector: '#thirdPage_PrimaryCC_Address_State'
		    });
		
		}
			
	};
	
	app.Contract = new app.Functions();
 
	$(function () {

		// initialize
		app.Contract.init();
		

	});
	
}(jQuery));

/*
Credit Card functions
*/
function getCreditCardType(accountNumber) {

    //start without knowing the credit card type
    var result = "--select--";

    //first check for MasterCard
    if (/^5[1-5]/.test(accountNumber)) {
        result = "mastercard";
    }

    //then check for Visa
    else if (/^4/.test(accountNumber)) {
        result = "visa";
    }

    //then check for AmEx
    else if (/^3[47]/.test(accountNumber)) {
        result = "amex";
    }

    return result;
}

function primaryCardEvent() {
    var value = $('#thirdPage_PrimaryCC_CardNumber').val(),
      type = getCreditCardType(value),
      element = $('#PrimaryCardType'),
      disp = $('#thirdPage_PrimaryCC_CCType');

    displayCardType(type, element, disp);
}

function displayCardType(type, element, disp) {
    element.children('.mc').removeClass('mc').addClass('mc-dull');
    element.children('.visa').removeClass('visa').addClass('visa-dull');
    element.children('.amex').removeClass('amex').addClass('amex-dull');
    
	switch (type) {
        case "mastercard":
            //show MasterCard icon
            disp.val('MasterCard');
            element.children('.mc-dull').removeClass('mc-dull').addClass('mc');
            break;

        case "visa":
            //show Visa icon
            disp.val('Visa');
            element.children('.visa-dull').removeClass('visa-dull').addClass('visa');
            break;

        case "amex":
            //show American Express icon
            disp.val('American Express');
            element.children('.amex-dull').removeClass('amex-dull').addClass('amex');
            break;

        default:
            //clear all icons?
            disp.val('');
            //show error?
    }
}