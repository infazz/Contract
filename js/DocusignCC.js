

function initializePage() {
    EDContract.Construct();
    EDCNav.Construct('#ExhibitNavigation', 3);
    EDContract.JoinToNav();

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

    //EDContract.SetPageProperty(EDContract.SelectPageByID("payment"), 'onValidate', function () {
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


    // re-activate page
    // this fixes a bug where added functions in this file are not run
    EDContract.RefreshPage();
}

function FinishLater(url) {
    var confirmTxt = "Are you sure you want to finish this record later? If yes, you can retrieve this record by checking the \"Sales-In Progress Page.\"";
    if (confirm(confirmTxt)) {
        location.href = url;
    }
}

$(document).ready(function () {

    initializePage();

    var ccZip = new ZipSearch();
    ccZip.init({
        loaderSelector: '#City .loader',
        cancelSelector: '#City .cancel-loading',
        messageSelector: '#City .zip-messages',
        zipSelector: '#thirdPage_PrimaryCC_Address_Zip',
        cityTextboxSelector: '#thirdPage_PrimaryCC_Address_City',
        cityDropdownSelector: '#CityAutocomplete',
        otherCitySelector: '#OtherCity',
        listCitySelector: '#ListCity',
        stateSelector: '#thirdPage_PrimaryCC_Address_State'
    });

    if ($("#chkCopyProfileInfo").is(":checked")) {
        $("#thirdPage_PrimaryCC_HolderName").attr('readonly', 'readonly');
        $("#thirdPage_PrimaryCC_Address_Address1").attr('readonly', 'readonly');
        $("#thirdPage_PrimaryCC_Address_Address2").attr('readonly', 'readonly');
        $("#thirdPage_PrimaryCC_Address_City").attr('readonly', 'readonly');
        $("#thirdPage_PrimaryCC_Address_State").attr('readonly', 'readonly');
        $("#thirdPage_PrimaryCC_Address_Zip").attr('readonly', 'readonly');
    }

    // Use Signing Details Checkbox
    $("#chkCopyProfileInfo").click(function () {

        $("#thirdPage_PrimaryCC_HolderName").val('').removeAttr('readonly');
        $("#thirdPage_PrimaryCC_Address_Address1").val('').removeAttr('readonly');
        $("#thirdPage_PrimaryCC_Address_Address2").val('').removeAttr('readonly');
        $("#thirdPage_PrimaryCC_Address_State").val('').removeAttr('readonly');
        $("#thirdPage_PrimaryCC_Address_City").val('').removeAttr('readonly');
        $("#thirdPage_PrimaryCC_Address_Zip").val('').removeAttr('readonly');

        ccZip.ActivateControls();

        if ($('#chkCopyProfileInfo').attr('checked')) {
            var valueOfFirstName = $('#firstpage_firstname').val();
            var valueOfLastName = $('#firstpage_lastname').val();
            var valueOfAddress1 = $('#firstpage_address1').val();
            var valueOfAddress2 = $('#firstpage_address2').val();
            var valueOfCity = $('#firstpage_city').val();
            var valueOfState = $('#firstpage_state').val();
            var valueOfZip = $('#firstpage_zip').val();

            // use before copying since this function also clears the city texbox
            ccZip.ShowCityTextbox();
            ccZip.DeactivateControls();

            $("#thirdPage_PrimaryCC_HolderName").val(valueOfFirstName + ' ' + valueOfLastName).attr('readonly', 'readonly');
            $("#thirdPage_PrimaryCC_Address_Address1").val(valueOfAddress1).attr('readonly', 'readonly');
            $("#thirdPage_PrimaryCC_Address_Address2").val(valueOfAddress2).attr('readonly', 'readonly');
            $("#thirdPage_PrimaryCC_Address_City").val(valueOfCity).attr('readonly', 'readonly');
            $("#thirdPage_PrimaryCC_Address_State").val(valueOfState).attr('readonly', 'readonly');
            $("#thirdPage_PrimaryCC_Address_Zip").val(valueOfZip).attr('readonly', 'readonly');
        }

    });


    // Finish later handler
    $('.finish-later').click(function (e) {
        return false;
        return confirm("Are you sure you want to finish this record later? If yes, you can retrieve this record by checking the \"Sales-In Progress Page.\"");
    });
});



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

    /* no longer using Discover
    //then check for Discover
    else if (/^6(?:011|5)/.test(accountNumber)) {
        result = "discover";
    }
    */
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
    /*var children = element.children();
    for (var i = 0; i < children.length; i++) {
        if ($(children[i]).is('li')) {
            $(children[i]).removeClass('current');
            if ($(children[i]).hasClass(type)) {
                $(children[i]).addClass('current');

            }
        }
    }*/
    element.children('.mc').removeClass('mc').addClass('mc-dull');
    element.children('.visa').removeClass('visa').addClass('visa-dull');
    element.children('.amex').removeClass('amex').addClass('amex-dull');
    //element.children('.discover').removeClass('discover').addClass('discover-dull');
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

        /*case "discover":
            //show Discover icon
            disp.val('Discover');
            element.children('.discover-dull').removeClass('discover-dull').addClass('discover');
            break;
            */
        default:
            //clear all icons?
            disp.val('');
            //show error?
    }
}
