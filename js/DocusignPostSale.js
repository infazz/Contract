$(document).ready(function () {

    // Source
    internalUseChange();
    $('#secondPage_contractDetail_SelectedContractSource').change(function () {
        internalUseChange();
    });

    $('#split .editor-field select').change(function () {
        var splitTotal = 0;
        $('#split .editor-field select').each(function () {
            splitTotal += parseInt($(this).val(), 10);
            console.log(splitTotal);
        });
        var ae1percentage = 100 - splitTotal;
        $('#AE1Percentage').html(ae1percentage);
    });

    $('form').submit(function (e) {

        return (validateInternalUse() && validateSplit());
    });
});

function internalUseChange() {
    if ($('#secondPage_contractDetail_SelectedContractSource').val() == 'Tradeshow') {
        $('#tradeshow').show();
        $('#partner').hide();
        $('#secondPage_contractDetail_selectedPartnerName').val('');

    } else if ($('#secondPage_contractDetail_SelectedContractSource').val() == 'Partner') {
        $('#tradeshow').hide();
        $('#secondPage_contractDetail_selectedTradeShow').val('');
        $('#partner').show();
    } else {
        $('#tradeshow').hide();
        $('#secondPage_contractDetail_selectedTradeShow').val('');
        $('#partner').hide();
        $('#secondPage_contractDetail_selectedPartnerName').val('');
        
    }
}

function validateInternalUse() {
    var source = $('#secondPage_contractDetail_SelectedContractSource'),
        tradeshow = $('#secondPage_contractDetail_selectedTradeShow'),
        partner = $('#secondPage_contractDetail_selectedPartnerName');

    if (source.val().length < 1) {
        source.addClass('error');
        return false;
    } else if (source.val() == "Tradeshow") {
        if (tradeshow.val().length < 1) {
            tradeshow.addClass('error');
            return false;
        } else {
            tradeshow.removeClass('error');
        }
    } else if (source.val() == "Partner") {
        if (partner.val().length < 1) {
            partner.addClass('error');
            return false;
        } else {
            partner.removeClass('error');
        }
    } else {
        source.removeClass('error');
    }
    return true;
}

function validateSplit() {
    var se_ae1 = $('#secondPage_contractDetail_AccountExecutive1_SalesforceID'),
        se_ae2 = $('#secondPage_contractDetail_AccountExecutive2_SalesforceID'),
        se_ae3 = $('#secondPage_contractDetail_AccountExecutive3_SalesforceID'),
        se_sp1 = $('#secondPage_contractDetail_selectedSplit1'),
        se_sp2 = $('#secondPage_contractDetail_selectedSplit2'),
        se_sp3 = $('#secondPage_contractDetail_selectedSplit3');

    var se = new Array();
    var seNum = 0;

    var errorsArray = [];


    // ae1
    if (se_ae1.val()
                || se_sp1.val() != '0') {

        console.log('ae1');
        se[seNum] = se_ae1;
        if (validateField(null, se_ae1, { required: true, errorMsg: 'AE2 name is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

        se[seNum] = se_sp1;
        if (validateField(null, se_sp1, { required: true, minimum: 1, errorMsg: 'AE2 split percentage is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

    } else {
        removeFieldError(se_ae1);
        removeFieldError(se_sp1);
        errorsArray.push(true);
    }
    // ae2
    if (se_ae2.val()
                || se_sp2.val() != '0') {

        console.log('ae2');
        se[seNum] = se_ae2;
        if (validateField(null, se_ae2, { required: true, errorMsg: 'AE3 name is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

        se[seNum] = se_sp2;
        if (validateField(null, se_sp2, { required: true, minimum: 1, errorMsg: 'AE3 split percentage is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

    } else {
        removeFieldError(se_ae2);
        removeFieldError(se_sp2);
        errorsArray.push(true);
    }

    // ae3
    if (se_ae3.val()
                || se_sp3.val() != '0') {

        console.log('ae3');
        se[seNum] = se_ae3;
        if (validateField(null, se_ae3, { required: true, errorMsg: 'AE4 name is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

        se[seNum] = se_sp3;
        if (validateField(null, se_sp3, { required: true, minimum: 1, errorMsg: 'AE4 split percentage is required' })) {
            errorsArray.push(true);
        } else {
            errorsArray.push(false);
        }
        seNum++;

    } else {
        removeFieldError(se_ae3);
        removeFieldError(se_sp3);
        errorsArray.push(true);
    }


    var splitTotal = 0;
    if (se.length > 0) {
        for (var i = 1; i < se.length; i += 2) {
            splitTotal += parseInt($(se[i]).val(), 10);
            var ae1percentage = 100 - splitTotal;
            $('#AE1Percentage').html(ae1percentage);
        }
        console.log('split total ' + splitTotal);
        if (splitTotal > 99) {
            var splitError = $('#split-validation');
            splitError.html('Please check split percentages');

            for (var i = 1; i < se.length; i += 2) {
                $(se[i]).addClass('error');
                console.log('split validation false');
                errorsArray.push(false);
            }
        } else {
            var splitError = $('#split-validation');
            splitError.html('');
            for (var i = 1; i < se.length; i += 2) {
                $(se[i]).removeClass('error');
                console.log('split validation true');
                errorsArray.push(true);
            }
        }
    }

    /*
    if ($('select.input-validation-error').length > 0
        || $('.field-validation-error').length > 0
        || $('input.error').length > 0
        || $('textarea.error').length > 0
        || $('select.error').length > 0) {
        console.log('valdiate false');
        return false;
    }*/
    if (errorsArray.indexOf(false) > -1) {
        console.log('valdiate false');
        return false;
    }
    console.log('valdiate true');
    return true;
}


/*
Field validation functions
*/
function validateField(checkbox, field, options) {
    var errorMsgMin = 'Percentage Error',
        errorMsg;
    if (options.errorMsg) {
        errorMsg = options.errorMsg;
    }
    if (!checkbox || checkbox.is(':checked')) {
        if (options.minimum) {
            if (validateMin(field.val(), options.minimum)) {
                removeFieldError(field);
                console.log('min met: ');
                console.log(field);
            } else {
                field.addClass('error');
                displayFieldError(field, errorMsgMin);
                console.log('min not met:');
                console.log(field);
                return false;
            }
        }
        if (options.required == true) {
            if (field.val().length > 0) {
                removeFieldError(field);
            } else {
                field.addClass('error');
                displayFieldError(field, errorMsg); ;
                //console.log('required not met:');
                //console.log(field);
                return false;
            }
        }
    } else {
        if (options.required == true) {
            field.addClass('error');
            displayFieldError(field, errorMsg); ;
            //console.log('required not met:');
            //console.log(field);
            return false;
        }
        removeFieldError(field);
    }
    return true;
}

function validateMin(val, min) {
    if (val >= min) {
        return true;
    }
    return false;
}
function displayFieldError(field, message) {
    if ($('body').find('span[data-valmsg-for="' + field.attr('name') + '"]').length > 0) {
        $('span[data-valmsg-for="' + field.attr('name') + '"]').html(message);
        $('span[data-valmsg-for="' + field.attr('name') + '"]').addClass('field-validation-error');
    }
}

function removeFieldError(field) {
    field.removeClass('error');
    if ($('body').find('span[data-valmsg-for="' + field.attr('name') + '"]').length > 0) {
        $('span[data-valmsg-for="' + field.attr('name') + '"]').html('');
        $('span[data-valmsg-for="' + field.attr('name') + '"]').removeClass('field-validation-error').addClass('field-validation-valid');
    }
}

/*
Array prototype indexof 
Taken from: http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}