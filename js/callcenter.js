if (!window.console) console = { log: function () { } };

soundManager.setup({

    // location: path to SWF files, as needed (SWF file name is appended later.)

    url: '/Content/',

    // optional: version of SM2 flash audio API to use (8 or 9; default is 8 if omitted, OK for most use cases.)
    flashVersion: 9,

    // use soundmanager2-nodebug-jsmin.js, or disable debug mode (enabled by default) after development/testing
    debugMode: false,

    useConsole: true,
    //noSWFCache: true,

    // good to go: the onready() callback

    onready: function () {

        // SM2 has started - now you can create and play sounds!
        
        var mySound = soundManager.createSound({
            id: 'aSound',
            autoPlay: false,
            url: ''
            // onload: function() { console.log('sound loaded!', this); }
            // other options here..
        });

        //mySound.play();
        
    },

    // optional: ontimeout() callback for handling start-up failure

    ontimeout: function () {

        // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
        // See the flashblock demo when you want to start getting fancy.

    }

});

var PP_CONFIG = {
    autoStart: false, // begin playing first sound when page loads
    playNext: false, // stop after one sound, or play through list until end
    useThrottling: false, // try to rate-limit potentially-expensive calls (eg. dragging position around)</span>
    usePeakData: false, // [Flash 9 only] whether or not to show peak data (left/right channel values) - nor noticable on CPU
    useWaveformData: false, // [Flash 9 only] show raw waveform data - WARNING: LIKELY VERY CPU-HEAVY
    useEQData: false, // [Flash 9 only] show EQ (frequency spectrum) data
    useFavIcon: false // try to apply peakData to address bar (Firefox + Opera) - performance note: appears to make Firefox 3 do some temporary, heavy disk access/swapping/garbage collection at first(?) - may be too heavy on CPU
}

// Call Quality handlers
// Elements not available on DOM ready so using the on() function
$(document).on('change', 'input[name="ClassificationID"], select[name="ClassificationID"], input[name="ClassificationDud"]', function () {
    if ($(this).attr('name') == 'ClassificationID') {
        if ($(this).get(0).tagName == 'SELECT') {
            if ($(this).val() != '0') {
                $('input[name="ClassificationDud"]').attr('checked', 'checked');
                $('input[name="ClassificationID"]').removeAttr('checked');
            }
        } else {
            $('select[name="ClassificationID"]').val('0');
            $('input[name="ClassificationDud"]').removeAttr('checked');
        }
    } else if ($(this).attr('name') == 'ClassificationDud') {
        $('input[name="ClassificationID"]').removeAttr('checked');
    }
});
// Validate Call Quality form
$(document).on('submit', '#CallQuality form', function () {
    $('#CallQualityValidation').html('');
    if ($('input[name="ClassificationDud"]').is(':checked')) {
        if ($('select[name="ClassificationID"]').val() != '0') {
            return true;
        }
        //console.log('nope');
        $('div#CallQualityValidation').html('Reason for marking as dud required');
        return false;
    }
});

// Recording row handler
$(document).on('click', 'li.recording-row a', function () {
    $('li.recording-row').removeClass('selected');
    $(this).parent().addClass('selected');
    if ($(this).hasClass('button')) {
        $(this).next().click();
    }
});

$(document).on('keyup', 'textarea#Annotation', function () {
    var maxchar = 1000;
    var cnt = $(this).val().length;
    var remainingchar = maxchar - cnt;
    if (remainingchar < 0) {
        $('#annotationCounter').html('0');
        $(this).val($(this).val().slice(0, 1000));
    } else {
        $('#annotationCounter').html(remainingchar);
    }
});

$(document).on('keyup', 'textarea#AnnotationInternal', function () {
    var maxchar = 1000;
    var cnt = $(this).val().length;
    var remainingchar = maxchar - cnt;
    if (remainingchar < 0) {
        $('#annotationInternalCounter').html('0');
        $(this).val($(this).val().slice(0, 1000));
    } else {
        $('#annotationInternalCounter').html(remainingchar);
    }
});



/****
deactivated temporarily
****/

$(document).ready(function () {

    var EDPobj = EDPobj || {};

    EDPobj.doctorNames = {};

    //Defaulting the Category to All
    EDPobj.doctorNames.cat = 'All';

    // 'Choose a product' onchange
    $('#Categories').change(function () {

        EDPobj.doctorNames.cat = $('#CategoriesForm option:selected').val();

        switch (EDPobj.doctorNames.cat) {
            case '1':
                EDPobj.doctorNames.cat = 'All'
                break;
            case '2':
                EDPobj.doctorNames.cat = 'Plasticsurgery'
                break;
            case '3':
                EDPobj.doctorNames.cat = 'Dentistry'
                break;
            case '4':
                EDPobj.doctorNames.cat = 'Undefined'
                break;
            default:
                EDPobj.doctorNames.cat = 'All'
        }

        //cat has been set
    });


    //Autocomplete for Doctors
    $('#DoctorsTxt').autocomplete({
        source: function (request, response) {

            $.getJSON('/CallCenter/Getdoctorsbyname?doctorname=' + request.term + '&categories=' + EDPobj.doctorNames.cat, function (data) {
                //alert("success");

                response($.map(data, function (item) {
                    return {
                        label: item.Text,
                        value: item.Text, //In this case, we want the val to be the txt.
                        hiddenVal: item.Value  //putting the val into the hidden input
                    }

                }))

            });
        },
        minLength: 1,
        select: function (event, ui) {

            $('input[name=DoctorName]').val(ui.item.label);

            $('input[name=Doctors]').val(ui.item.hiddenVal);

            var UrlSegments = ui.item.hiddenVal.split('|');

            $('#divShareLinkForSalesForce').text(window.location.protocol + '//' + window.location.host + '/callcenter?doctors=' + UrlSegments[0] + '|' + UrlSegments[1]);

            $(this.form).submit();

        }
    });






    //THIS IS THE ORIGINAL SETUP 

    // Choose a Doctors onchange 
    //    $('#Doctors').live('change', function () {
    //        $('input[name=DoctorName]').val($('#Doctors option:selected').text());

    //        $('#divShareLinkForSalesForce').text(window.location.protocol + '//' + window.location.host + '/callcenter/' + $('#Doctors option:selected').val() + '/' + $('#DoctorName').val());
    //        $(this.form).submit();


    //    });


    //Expand/Collapse SF Notes
    $('.callcenter #salesforce h3 span').live('click', function () {

        $(this).parent().next().toggle('fast', function () {

            var titleControl = $(this).parent().find('span');

            if (titleControl.text() === '+') {
                titleControl.text('-');
            } else {
                titleControl.text('+');
            }

        });
    });

    //Filtering options
    $('.dudfilter a').live('click', function (e) {
        e.preventDefault();
        var str = $(this).prop('href'),
            start = str.indexOf('#') + 1,
            strResult = str.substr(start),
            itemsHidden = $('#result-set li').not(':visible');

        //Already on active tab, so do nothing, end function
        if ($(this).hasClass('active')) {
            return;
        }

        $('.dudfilter a').removeClass('active');
        $(this).addClass('active');

        //Clear out Notes region
        $('#Annotations').empty();

        //Perform hide/show depending on the call-quality
        switch (strResult) {
            case 'all':

                //show all to reset
                itemsHidden.show();

                break;

            case 'lead':

                //show all to reset
                itemsHidden.show();

                //find those with no call quality
                $('#result-set .call-quality-group').not(':visible').closest('li').hide();

                //match call quality to selected option
                $('#result-set .call-quality').not('.lead').closest('li').hide();

                break;

            case 'appointment':

                itemsHidden.show();

                $('#result-set .call-quality-group').not(':visible').closest('li').hide();

                $('#result-set .call-quality').not('.appointment').closest('li').hide();

                break;

            case 'dud':

                itemsHidden.show();

                $('#result-set .call-quality-group').not(':visible').closest('li').hide();

                $('#result-set .call-quality').not('.dud').closest('li').hide();

                break;

            default:

                itemsHidden.show();

                break;

        }

    })

});


function insertSalesForceNote() {

    //console.log(arguments.callee.name)

    if (!$('#newRecordMsg').length) {
        $('<div id="newRecordMsg"></div>').insertAfter('#salesforce h2');
    }

}

function noteSuccess() {

    //console.log(arguments.callee.name)

    $('#newRecordMsg')
        .addClass('recordMsgItem')
        .removeAttr('id');

}

//begin of selected doctor json call
function doctorLoading() {

    //console.log(arguments.callee.name)

    $('.loader').show();

    if ($('#CSDoctorFilter .sfnotes-data').length) {

        $('#CSDoctorFilter .sfnotes-data').remove();

    }

}

//success of selected doctor json call
function doctorSelect() {

    //console.log(arguments.callee.name)

    $('.loader').hide();

    //TEMPORARILY DISABLED the below

//        $('<div class="content-box sfnotes-data"></div>').insertAfter($('#CSDoctorFilter .content-box').last());



//    var sfnotesData = $('#CSSalesForceNotes').detach();

//    $('#CSDoctorFilter .content-box').last().append(sfnotesData);




}


function SetAggregatesForCurrentCalls() {
    
    //Set the counts
    $('.dudfilter .filter-all a:first').text('All(' + $('.recording-row .call-quality-group').length + ')');
    $('.dudfilter .filter-leads a:first').text('Leads(' + $('.recording-row span.call-quality.lead').length + ')');
    $('.dudfilter .filter-appointments a:first').text('Appointments(' + $('.recording-row span.call-quality.appointment').length + ')');
    $('.dudfilter .filter-duds a:first').text('Duds(' + $('.recording-row span.call-quality.dud').length + ')');
}


