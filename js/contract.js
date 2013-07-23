/* === === === === === === === === === === === === === === === === === 
    EDContract - Contract Controller
    EDCNav - Contract Navigation
    Optimized for Desktop and Mobile

    Dependencies:
        jQuery minimum 1.5

    Author: Sean Mooney
    Date: 12-11-2012


=== === === === === === === === === === === === === === === === === */
// Use log only on local
var useLog;
if (window.location.hostname.indexOf("local") !== -1) {
    useLog = true;
} else {
    useLog = false;
}

// console definition
if (!window.console) {
    var console = {
        log: function () { }
    };
}

// Define EDContract object
var EDContract = EDContract || {};

// EDContract vars
EDContract.formReference = 'form';
EDContract.pageSelector = '.edc-page';
EDContract.pageErrors = '#PageErrors';
EDContract.elementSelector = '.edc-element';
//EDContract.localStorageName = 'EDContract';
EDContract.currentPageNum = 0;
EDContract.totalPages = 0;
EDContract.pages = [];
EDContract.elements = [];
EDContract.invalidElements = [];
EDContract.groups = [];
EDContract.totalContractVal = 0;



// EDContract
(function () {
    "use strict"; //because javascript
    

    
    /* Constructor
    === === === === === === === === === === === === === === === */
    EDContract.Construct = function() {
        EDContract.ConstructPages();
        //EDContract.GoToPage(EDContract.currentPageNum);
    };
    
    
    /* Pages
    === === === === === === === === === === === === === === === */
    EDContract.ConstructPages = function() {
        $.each($(EDContract.pageSelector), function (i) {
            var self = this,
                options = {
                    key: i,
                    ID: $(self).attr('id'),
                    reference: $(self),
                    validated: false,
                    submitButton: ($(self).find('.continue').length > 0) ? $(self).find('.continue') : $('input[type="submit"]'),
                    addonReference: null
                };
            
            
            // Add page to array
            EDContract.pages[i] = options;
            
            // submit event
            $(options.submitButton).bind('click', function() {
                return EDContract.SubmitPage();
            });

            EDContract.ConstructElements(options.key);

            // get number of elements for this page
        });
        EDContract.totalPages = EDContract.pages.length;
    };

    EDContract.SetPageProperty = function(page, property, value) {
        LOG('set page property');
        page[property] = value;
        if (EDContract.currentPage == page.key) {
            LOG('  on current page');
        }
    };

    EDContract.PageAddonReference = function(page, addonSelector) {
        page.addonReference = $(addonSelector);
    };

    EDContract.JoinToNav = function() {
        for (var i = 0; i < EDContract.totalPages; i++) {
            EDCNav.JoinToPage(i);
        }
    };

    EDContract.SubmitPage = function() {
        LOG('\nSubmitPage Validate ' + EDContract.currentPageNum);
        
        return EDContract.ValidatePage(EDContract.currentPageNum);
        
    };

    EDContract.OverridePageSubmit = function() {

    };

    EDContract.SubmitMultiplePages = function(pages) {
        LOG('\nSubmitMultiplePages Validate Multiple Pages : ');
        
        var validateArray = [];
        for (var i = 0; i < pages.length; i++) {
            validateArray[i] = EDContract.ValidatePage(pages[i]);
        }
        if (validateArray.indexOf(false) > -1) {
            return false;
        }
        return true;
    };

    EDContract.LoadAllElementsFromStorage = function() {
        for (var i = 0; i < EDContract.pages.length; i++) {
            var pageElements = EDContract.elements[i];
            for (var j = 0; j < pageElements.length; j++) {
                //LOG('load from storage: ' + EDContract.elements[i][j].ID);
                EDContract.LoadElementData(i, j);
                EDContract.SetElement(EDContract.elements[i][j]);
            }
        }
    };

    EDContract.ActivateCurrentPage = function() {
        LOG('\nActivate ' + EDContract.currentPageNum);
        
        var i,
            pageElements = EDContract.elements[EDContract.currentPageNum];

        for (i = 0; i < pageElements.length; i++) {
            if (!EDContract.elements[EDContract.currentPageNum][i].bind) {
                EDContract.ActivateElementEvents(EDContract.elements[EDContract.currentPageNum][i]);
            }
        }
    };

    EDContract.DeactivateCurrentPage = function() {
        LOG('\nDeactivate ' + EDContract.currentPageNum);

        var i,
            pageElements = EDContract.elements[EDContract.currentPageNum];

        for (i = 0; i < pageElements.length; i++) {
            if (EDContract.elements[EDContract.currentPageNum][i].bind) {
                EDContract.DeactivateElementEvents(EDContract.elements[EDContract.currentPageNum][i]);
            }
        }
    };

    EDContract.RefreshPage = function() {
        //EDContract.DeactivateCurrentPage();
        //EDContract.ActivateCurrentPage();
        EDContract.GoToPage(EDContract.currentPageNum);
    };

    EDContract.GoToPage = function(pageNum) {
        EDContract.DeactivateCurrentPage();

        for (var i = 0; i < EDContract.totalPages; i++) {
            if (i === pageNum) {
                // Open!
                $(EDContract.pages[i].reference).slideDown();
                if (EDContract.pages[i].addonReference) {
                    $(EDContract.pages[i].addonReference).slideDown();
                }
            } else {
                // Close!
                $(EDContract.pages[i].reference).slideUp();
                if (EDContract.pages[i].addonReference) {
                    $(EDContract.pages[i].addonReference).slideUp();
                }
            }
        }

        EDContract.currentPageNum = pageNum;
        EDContract.ActivateCurrentPage();
    };

    EDContract.GoToNextPage = function() {
        if (EDContract.currentPageNum < EDContract.totalPages) {
            EDContract.GoToPage(EDContract.currentPageNum+1);
        }
    };

    EDContract.GoToPrevPage = function() {
        if (EDContract.currentPageNum > 0) {
            EDContract.GoToPage(EDContract.currentPageNum-1);
        }
    };

    EDContract.GoToPageHash = function(hash) {
        var gotopage = 0;
        for (var i = 0; i < EDContract.totalPages; i++) {
            if (hash === '#'+EDContract.pages[i].ID) {
                gotopage=i;
            }
        }
        EDContract.GoToPage(gotopage);
    };

    /* Elements
    === === === === === === === === === === === === === === === */
    EDContract.ConstructElements = function(pageKey) {
        var parentID = EDContract.pages[pageKey].ID;

        EDContract.elements[pageKey] = [];
        $.each($('#' + parentID + ' ' + EDContract.elementSelector), function (i) {
            var self = $(this),
                // default rules
                rules = {
                    //element required to validate
                    required: false,
                    //array of values to ignore in validation
                    ignoreValues: [], 
                    //array of values that are invalid
                    invalidValues: [], 
                    //requires this CustomElement to be selected/true
                    dependancyID: null, 
                    //requires this function to return true
                    dependancyFunc: null, 
                    //minimum value to validate (dataType int only)
                    minimum: null, 
                    //minimum length of input to validate
                    minimumLength: null, 
                    //setup fee associated with this element
                    setupFee: 0, 
                    //callback function when validated true
                    validCallback: null
                },
                // secondary input rules
                secondaryRules = { 
                    required: false,
                    ignoreValues: [],
                    invalidValues: [],
                    dependancyID: null,
                    dependancyFunc: null,
                    minimum: null,
                    minimumLength: null,
                    setupFee: 0,        
                    validCallback: null
                },
                //contain all element data
                options = { 
                    //key
                    key: i,
                    //jQuery reference
                    reference: self,
                    //DOM ID
                    ID: self.attr('id'),
                    //page key of element
                    pageKey: pageKey,
                    checkable: false,
                    //element bound to events
                    bind: false,
                    //default ruleset
                    rules: rules,
                    secondaryRules: secondaryRules
                };

            


            // Add element to array
            EDContract.elements[pageKey][options.key] = options;
            
            // Load element data
            EDContract.LoadElementData(pageKey, options.key);

            // set element
            EDContract.SetElement(EDContract.elements[pageKey][options.key]);

            //LOG('\nElement:');
            //LOG(options);
        });
    };

    EDContract.LoadElementData = function(pageKey, elementKey) {
        var element = EDContract.elements[pageKey][elementKey],
            self = element.reference;
        
        // checkbox stuff
        if (self.find('.editor-check input[type="checkbox"]').length > 0) {
            element.checkable = true,
            element.checkbox = self.find('.editor-check input[type="checkbox"]'),
            element.checkboxHidden = self.find('.editor-check input[type="hidden"]');
        }

        // field data
        var inputPrefix = '';
        if (self.find('.editor-field').length > 0 ) {
            inputPrefix = '.editor-field ';
        }
        if (self.find(inputPrefix + 'input').length > 0) {
            element.input = self.find(inputPrefix + 'input');
            element.inputID = $(element.input).attr('id');
            element.inputName = $(element.input).attr('name');
        } else { // check for select box
            if (self.find(inputPrefix + 'select').length > 0) {
                element.input = self.find(inputPrefix + 'select');
                element.inputID = $(element.input).attr('id');
                element.inputName = $(element.input).attr('name');
            } else { // check for textarea
                if (self.find(inputPrefix + 'textarea').length > 0) {
                    element.input = self.find(inputPrefix + 'textarea');
                    element.inputID = $(element.input).attr('id');
                    element.inputName = $(element.input).attr('name');
                }
            }
        }
        
        // get input error container
        if (self.find('.editor-field span[data-valmsg-for="' + element.inputName + '"]').length > 0) {
            element.input.errorContainer = self.find('.editor-field span[data-valmsg-for="' + element.inputName + '"]');
        }

        // secondary field data
        if (self.find('.editor-label input').length > 0) {
            element.secondaryInput = self.find('.editor-label input');
            element.secondaryInputID = $(element.secondaryInput).attr('id');
            element.secondaryInputName = $(element.secondaryInput).attr('name');
        } else { // check for select box
            if (self.find('.editor-label select').length > 0) {
                element.secondaryInput = self.find('.editor-label select');
                element.secondaryInputID = $(element.input).attr('id');
                element.secondaryInputName = $(element.input).attr('name');
            } else { // check for textarea
                if (self.find('.editor-label textarea').length > 0) {
                    element.secondaryInput = self.find('.editor-field textarea');
                    element.secondaryInputID = $(element.input).attr('id');
                    element.secondaryInputName = $(element.input).attr('name');
                }
            }
        }
        
        // get secondary input error container
        if (self.find('.editor-label span[data-valmsg-for="' + element.secondaryInputName + '"]').length > 0) {
            element.secondaryInput.errorContainer = self.find('.editor-field span[data-valmsg-for="' + element.secondaryInputName + '"]');
        }

        // get element error container 
        if (self.find('.element-errors').length > 0 ) {
            element.errorContainer = self.find('.element-errors');
        }

        // Get current selected status in case of default or localstorage values
        element.selected = EDContract.IsElementSelected(element);
            
        // rules
        // check if required
        if (self.hasClass('required')) {
            element.rules.required = true;
        }

        EDContract.elements[pageKey][elementKey] = element;
    };

    EDContract.SetElementInput = function(element, selector) {
        element.input = element.reference.find(selector);
        element.inputID = $(element.input).attr('id');
        element.inputName = $(element.input).attr('name');
    };

    EDContract.SetElementSecondaryInput = function(element, selector) {
        element.secondaryInput = element.reference.find(selector);
        element.secondaryInputID = $(element.secondaryInput).attr('id');
        element.secondaryInputName = $(element.secondaryInput).attr('name');
    };

    // options - object defining rules of element
    EDContract.SetElementRules = function(element, rules) {
        // one of the worst named functions ever
        // merge new rules with current rules
        jQuery.extend(true, element.rules, rules);
        if (element.bind === true) {
            EDContract.ActivateElementEvents(element);
        }
    };

    // options - object defining rules of element
    EDContract.SetElementSecondaryRules = function(element, rules) {
        // one of the worst named functions ever
        // merge new rules with current rules
        jQuery.extend(true, element.secondaryRules, rules);
        if (element.bind === true) {
            EDContract.ActivateElementEvents(element);
        }
    };
    
    // dependancy function definition
    EDContract.SetDependancyFunction = function(element, fn) {
        if (typeof fn == 'function') {
            element.dependancyFunc = fn;
        }
        if (element.bind === true) {
            EDContract.ActivateElementEvents(element);
        }
    };

    // Common function to create a new property
    EDContract.SetProperty = function(element, property, value) {
        element[property] = value;
        /*if (element.bind === true) {
            EDContract.DeactivateElementEvents(element);
            EDContract.ActivateElementEvents(element);
        }*/
    };

    // Switch element selected status
    // @select - optional boolean
    EDContract.ToggleElement = function(element, select) {
        if (select === null) {
            element.selected = !element.selected;
            EDContract.SetElement(element);
        } else {
            element.selected = select;
            EDContract.SetElement(element);
        }
    };

    // Read elements 
    EDContract.SetElement = function(element) {
        if (element.checkable) {
            var self = $(element.reference);
			LOG("element: " + element.ID + " "+ element.selected)
            if (element.selected) {
                $(self).addClass('selected');
                $(element.checkbox).attr('checked', 'checked').val('true');
                $(element.checkboxHidden).val('true');
                
                if (typeof element.onSelect === 'function') {
                    element.onSelect();
                }
				
            } else {
                $(self).removeClass('selected');
                $(element.checkbox).removeAttr('checked').val('false');
                $(element.checkboxHidden).val('false');

                // clear errors
                if (element.input) {
                    EDContract.ClearFieldError(element, element.input);
                }
                if (element.secondaryInput) {
                    EDContract.ClearFieldError(element, element.secondaryInput);
                }
                EDContract.ClearElementError(element);

                if (typeof element.onDeselect === 'function') {
                    element.onDeselect();
                }
            }
        }
    };

    EDContract.IsElementSelected = function(element) {
        if (element.checkbox != null) {
            if ($(element.checkbox).is(':checked') || $(element.checkboxHidden).val() === 'true') {
                return true;
            }
        } else {
            return true;
        }
        
        return false;
    };
    

    // Activate events
    EDContract.ActivateElementEvents = function (element) {
        LOG('Activate: ' + element.ID);
        $(element.reference).bind('click', function(e) {
            var target = e.target;
            if (target.nodeType === 3) {     // This is a text node. Force use of parent node.
                target = target.parentNode;
            }
            if (target.nodeName === 'OPTION') {
                target = target.parentNode;
            }
            
            if (target.nodeName !== 'INPUT' && target.nodeName !== 'SELECT') {
                LOG('toggle nodename input');
                EDContract.ToggleElement(element, null);
            } else {
                if ($(target).attr('type') === 'checkbox' && $(target).parent().hasClass('editor-check')) {
                    LOG('toggle attr checkbox');
                    EDContract.ToggleElement(element, null);
                }
            }

            // check if this has a setup
            if (typeof element.rules.setupID === 'string') {
                var setupElement = EDContract.SelectElementByID(element.rules.setupID);

                // toggle if the setupID element applies to ONLY this element
                // unless defined by serviceIDAutoSelect boolean
                if (typeof setupElement.rules.serviceID === 'string') {
                    EDContract.ToggleElement(setupElement, element.selected);
                }
                if (element.rules.setupIDAutoSelect === true) {
                    EDContract.ToggleElement(setupElement, element.selected);
                }

            } else if (typeof element.rules.setupID === 'object') {
                var setupElements,
                    i;
                for (i = 0; i < element.rules.setupID.length; i++) {
                    setupElements = EDContract.SelectElementByID(element.rules.setupID[i]);

                    // toggle if the setupID element applies to ONLY this element
                    // unless defined by setupIDAutoSelect boolean
                    if (typeof setupElements.rules.serviceID === 'string') {
                        EDContract.ToggleElement(setupElements, element.selected);
                    }
                    if (element.rules.setupIDAutoSelect === true) {
                        EDContract.ToggleElement(setupElements, element.selected);
                    }
                }
            }

            // check if this is a setup
            if (typeof element.rules.serviceID === 'string') {
                var serviceElement = EDContract.SelectElementByID(element.rules.serviceID);
                
                // toggle if the serviceID element applies to ONLY this element
                // unless defined by serviceIDAutoSelect boolean
                if (typeof serviceElement.rules.setupID === 'string') {
                    EDContract.ToggleElement(serviceElement, element.selected);
                }
                if (element.rules.serviceIDAutoSelect === true) {
                    EDContract.ToggleElement(serviceElement, element.selected);
                }
            } /*
            // do not select all services
            else if (typeof element.rules.serviceID === 'object') {
                var serviceElements,
                    i;
                for (i = 0; i < element.rules.serviceID.length; i++) {
                    serviceElements = EDContract.SelectElementByID(element.rules.serviceID[i]);

                    // toggle if the serviceID element applies to ONLY this element
                    if (typeof serviceElements.rules.setupID === 'string') {
                        EDContract.ToggleElement(serviceElements, element.selected);
                    }
                }
            }*/
            
            // groups
            if (typeof element.rules.radioGroup === 'object') {
                var radioElement,
                    i;

                for (i = 0; i < element.rules.radioGroup.length; i++) {
                    radioElement = EDContract.SelectElementByID(element.rules.radioGroup[i]);

                    EDContract.ToggleElement(radioElement, false);
                }
            }

        });

        if (typeof element.onChange === 'function') {
            $(element.input).bind('keyup keydown blur click', function (e) {
                element.onChange(e);
            });
        }
        if (typeof element.onActivate === 'function') {
            element.onActivate();
        }

        element.bind = true;
    };
    
    // Deactivate events
    EDContract.DeactivateElementEvents = function (element) {
        $(element.reference).unbind('click');
        $(element.input).unbind('keyup keydown blur');
        
        element.bind = false;
    };



    /* Validation
    === === === === === === === === === === === === === === === */
    EDContract.ValidatePage = function (pageNum) {
        LOG('\nvalidate page ' + pageNum);
        var i,
//            pageReference = EDContract.pages[EDContract.currentPageNum],
//            pageElements = EDContract.elements[EDContract.currentPageNum],
            pageReference = EDContract.pages[pageNum],
            pageElements = EDContract.elements[pageNum],
            validateArray = [],
            selectArray = [];

        for (i = 0; i < pageElements.length; i++) {
            EDContract.elements[pageNum][i].skipThis = false;
        }

        for (i = 0; i < pageElements.length; i++) {
            validateArray[i] = EDContract.ValidateElement(EDContract.elements[pageNum][i]);
            selectArray[i] = EDContract.IsElementSelected(EDContract.elements[pageNum][i]);
            LOG(EDContract.elements[pageNum][i].ID + ' seleted:' + selectArray[i]);
        }
        
        if (typeof pageReference.onValidate == 'function') {
            if (pageReference.onValidate() === false) {
                LOG("onValidate FAIL!");
                validateArray.push(false);
            } else {
                LOG("onValidate SUCCESS!");
                validateArray.push(true);
            }
        }


        // check for any errors
        LOG('page validateArray:');
        LOG(validateArray);
        if (validateArray.indexOf(false) > -1) {
            var errorIndex = validateArray.indexOf(false),
                offset = {top:20,left:0};

            EDContract.ShowPageError(pageReference);
            EDCNav.ShowPageError(pageReference);

            if (EDContract.elements[pageNum].length > errorIndex) {
                LOG(EDContract.elements[pageNum][errorIndex]);
                offset = EDContract.elements[pageNum][errorIndex].reference.offset();
            }
            $(document).scrollTop(offset.top - 20);

            return false;
        }
        EDContract.ClearPageError(pageReference);
        EDContract.ClearBackendPageError(pageReference);
        EDCNav.ClearPageError(pageReference);
        return true;
    };
    
    EDContract.ShowPageError = function(page, msg) {
//        if ($(page.reference).children('#PageErrors').length < 1) {
//            
//        }
        var errorSelector = "#Error-"+page.ID;

        if ( $(EDContract.formReference).find(errorSelector).length < 1) {
            $(EDContract.formReference).append('<span id="Error-' + page.ID + '" class="page-error error">Please check the <a href="#' + page.ID + '">' + page.ID + ' page</a> for errors</span>');
            $(EDContract.formReference).prepend('<span id="Error-top-' + page.ID + '" class="page-error error">Please check the <a href="#' + page.ID + '">' + page.ID + ' page</a> for errors</span>');
        }
        if (msg) {
            $(EDContract.formReference).find('.msg').remove();
            $(page.reference).find('.msg').remove();

            $(page.reference).append('<span class="page-error error msg">' + msg + '</span>');
            $(EDContract.formReference).prepend('<span class="page-error error msg">' + msg + '</span>');
        }

    };

    EDContract.ClearPageError = function(page) {
        $(EDContract.formReference).children('#Error-' + page.ID).remove();
        $(EDContract.formReference).children('#Error-top-' + page.ID).remove();
        $(EDContract.formReference).find('.msg').remove();
    };

    EDContract.ClearBackendPageError = function(page) {
        if ($('#ExhibitErrors').length > 0) {
            if ($('#ExhibitErrors').find('a[href="#' + page.ID + '"]').length > 0) {
                $.each($('#ExhibitErrors').find('a[href="#' + page.ID + '"]'), function () {
                    $(this).parent().remove();
                });
            }
        }
        if ($('#ExhibitErrors ul li').length < 1) {
            $('#ExhibitErrors').remove();
        }
    };
    EDContract.ValidateElement = function (element) {
        LOG('\nvalidate element: ' + element.ID);
        LOG(element);
        LOG('skip? ' + element.skipThis);

        var inputVal, secondaryInputVal, selectVal, validateThis = false, errorArray = [];

        if (element.input) {
            inputVal = $(element.input).val();
        }
        if (element.secondaryInput) {
            secondaryInputVal = $(element.secondaryInput).val();
        }
        if (element.select) {
            selectVal = $(element.select).val();
        }


        
        if (element.rules.required === true) {   // is required
            LOG('  required');
            validateThis = true;
        } else {
            if (element.checkable) {
                LOG('  checkable');
                if(EDContract.IsElementSelected(element)) { // is checkable and is selected
                    LOG('  selected');
                    if(element.skipThis != true) {
                        validateThis = true;
                    }
                }
            }
        
        }

        LOG('validate? ' + validateThis);
        if (validateThis) {
            var setup,
                elementErrorsArray = [];

            // check required
            if (element.checkable) {
                if (!EDContract.IsElementSelected(element) && element.rules.required === true) {
                    LOG('this element is required');
                    EDContract.ShowElementError(element, 'Required');
                    elementErrorsArray.push(false);
                }
            }

            // check packages
            if (element.rules.includedServices) {
                LOG('checking packages');
                var i = 0,
                    services = element.rules.includedServices,
                    servicesLen = services.length,
                    service,
                    servicesErrors = [];

                for (i; i < servicesLen; i++) {
                    service = EDContract.SelectElementByID(services[i]);

                    if (service.selected) {
                        // if selected, log false
                        // display package/service error
                        
                        servicesErrors.push(!EDContract.IsElementSelected(service));
                        //EDContract.SetProperty(service, 'skipThis', true);
                        EDContract.SelectElementByID(services[i]).skipThis = true;
                        LOG(EDContract.SelectElementByID(services[i]));
                        LOG('set ' + service.ID + ' skip to true');
                        EDContract.ShowElementError(service, 'A selected package includes this service');
                    } else {
                        // if not selected clear package/service error
                        EDContract.ClearElementError(service);
                    }
                }

                if (servicesErrors.indexOf(false) > -1) {
                    LOG('  service already selected for this package!');
                    if (element.rules.errors != null && element.rules.errors.includedServices != null) {
                        EDContract.ShowElementError(element, element.rules.errors.includedServices);
                    } else {
                        EDContract.ShowElementError(element, 'A selected service is included with this package');
                    }
                    elementErrorsArray.push(false);
                }
            }

            
            // check if element has a setup
            //LOG('// check if element has a setup');
            //LOG('   setup: '+element.rules.setupID);
            if (element.rules.setupID != null) {
                if (typeof element.rules.setupID === 'string') {
                    setup = EDContract.SelectElementByID(element.rules.setupID);
                    LOG(setup);
                    if (EDContract.IsElementSelected(setup)) {
                        LOG('  has setup checked');
                    } else {
                        LOG('  setup not checked!');
                        if (element.rules.errors != null && element.rules.errors.setupID != null) {
                            EDContract.ShowElementError(element, element.rules.errors.setupID);
                        } else {
                            EDContract.ShowElementError(element, 'Set-up required for this service');
                        }
                        elementErrorsArray.push(false);
                    }
                } else if (typeof element.rules.setupID === 'object') {
                    var setupIDValidateArray = [];
                    for (var i = 0; i < element.rules.setupID.length; i++) {
                        setup = EDContract.SelectElementByID(element.rules.setupID[i]);
                        LOG(setup);
                        if (EDContract.IsElementSelected(setup)) {
                            LOG('  has setup checked');
                            setupIDValidateArray.push(true);
                        } else {
                            LOG('  setup not checked!');
                            if (element.rules.errors != null && element.rules.errors.setupID != null) {
                                EDContract.ShowElementError(element, element.rules.errors.setupID);
                            } else {
                                EDContract.ShowElementError(element, 'Set-up required for this service');
                            }
                            setupIDValidateArray.push(false);
                        }
                    }

                    // check that any of the setups have been selected (no validation for all yet)
                    LOG('   setup validate array: ' + setupIDValidateArray);
                    if (setupIDValidateArray.indexOf(true) < 0) {
                        elementErrorsArray.push(false);
                    }
                }

            }

            // check if element is a setup
            //LOG('// check if element has a service');
            //LOG('   service:' + element.rules.serviceID);
            if (element.rules.serviceID != null) {
                if (typeof element.rules.serviceID === 'string') {
                    setup = EDContract.SelectElementByID(element.rules.serviceID);
                    LOG(setup);
                    if (EDContract.IsElementSelected(setup)) {
                        LOG('  service checked');
                    } else {
                        LOG('  service not checked!');
                        if (element.rules.errors != null && element.rules.errors.serviceID != null) {
                            EDContract.ShowElementError(element, element.rules.errors.serviceID);
                        } else {
                            EDContract.ShowElementError(element, 'Set-Up Fee is only required when a service or package is purchased.');
                        }
                        elementErrorsArray.push(false);
                    }
                } else if (typeof element.rules.serviceID === 'object') {
                    var serviceValidateArray = [];
                    for (var i = 0; i < element.rules.serviceID.length; i++) {
                        setup = EDContract.SelectElementByID(element.rules.serviceID[i]);
                        LOG(setup);
                        if (EDContract.IsElementSelected(setup)) {
                            LOG('  service checked');
                            serviceValidateArray.push(true);
                        } else {
                            LOG('  service not checked!');
                            if (element.rules.errors != null && element.rules.errors.serviceID != null) {
                                EDContract.ShowElementError(element, element.rules.errors.serviceID);
                            } else {
                                EDContract.ShowElementError(element, 'Set-Up Fee is only required when a service or package is purchased.');
                            }
                            serviceValidateArray.push(false);
                            //return false;
                        }
                    }
                    
                    // check that any of the setups have been selected (no validation for all yet)
                    LOG('   setup validate array: ' + serviceValidateArray);
                    if (serviceValidateArray.indexOf(true) < 0) {
                        elementErrorsArray.push(false);
                    }
                }

            }
            
            // Element level error collection
            LOG('Element Errors Array: '+elementErrorsArray);
            if (elementErrorsArray.indexOf(false) > -1) {
                errorArray.push(false);
            } else {
                EDContract.ClearElementError(element);
            }

            // check element.input
            if (element.input) {
                errorArray.push(EDContract.ValidateElementField(element, element.input, element.rules));
            }
            // check element.secondaryInput
            if (element.secondaryInput) {
                errorArray.push(EDContract.ValidateElementField(element, element.secondaryInput, element.secondaryRules));
            }

            if (typeof element.dependancyFunc == 'function') {
                if (element.dependancyFunc() === false) {
                    LOG("DEPENDANCY FAIL!");
                    EDContract.ShowElementError(element, element.rules.errors.dependancyFunc);
                    errorArray.push(false);
                } else {
                    LOG("DEPENDANCY SUCCESS!");
                    errorArray.push(true);
                }
            }

            if (typeof element.onValidate == 'function') {
                if (element.onValidate() === false) {
                    LOG("onValidate FAIL!");
                    EDContract.ShowElementError(element, element.rules.errors.onValidate);
                    errorArray.push(false);
                } else {
                    LOG("onValidate SUCCESS!");
                    errorArray.push(true);
                }
            }
        }

        
        LOG('Errors Array: ' + errorArray + '\n\n');
        if (errorArray.indexOf(false) > -1) {
            return false;
        }

        // clear errors
        if (element.skipThis == false) {
            if (element.input) {
                EDContract.ClearFieldError(element, element.input);
            }
            if (element.secondaryInput) {
                EDContract.ClearFieldError(element, element.secondaryInput);
            }
            EDContract.ClearElementError(element);
        }
        return true;
    };

    EDContract.ValidateElementField = function(element, field, rules) {
        LOG(field);
        var fieldVal;
        if ($(field).is('select')) {
            fieldVal = $(field).val();
        } else {
            fieldVal = $(field).val();
        }
        
        // check for value
        if (fieldVal) {
            // check minimum
            //  checking for != null instead of false. If minimum is 0 it returns false as 0 is falsy
            if (rules.minimum != null) {
                if (fieldVal >= rules.minimum) {
                    LOG('  minimum PASS');
                } else {
                    LOG('  minimum not met!');
                    if (rules.errors != null && rules.errors.minimum != null) {
                        EDContract.ShowFieldError(element, field, rules.errorsminimum);
                    } else {
                        EDContract.ShowFieldError(element, field, 'Price Error');
                    }
                    return false;
                }
            }

            if (rules.minimumLength != null) {
                if (fieldVal.length >= rules.minimumLength) {
                    LOG('  min length PASS');
                } else {
                    LOG('  minimum length not met!');
                    if (rules.errors != null && rules.errors.minimumLength != null) {
                        EDContract.ShowFieldError(element, field, rules.errors.minimumLength);
                    } else {
                        EDContract.ShowFieldError(element, field, 'Required');
                    }
                    return false;
                }
            }


            // check if email, required typeof boolean and true
            if (rules.email == true) {
                var re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(fieldVal)) {
                    LOG('  email PASS');
                    // pass
                } else {
                    if (rules.errors != null && rules.errors.email != null) {
                        EDContract.ShowFieldError(element, field, rules.errors.email);
                    } else {
                        EDContract.ShowFieldError(element, field, 'Valid Email is Required');
                    }
                    return false;
                }
            }

            if (rules.phone == true) {
                LOG('this should be a phone number');
                if (fieldVal.length < 10) {
                    if (rules.errors != null && rules.errors.phone != null) {
                        EDContract.ShowFieldError(element, field, rules.errors.phone);
                    } else {
                        EDContract.ShowFieldError(element, field, 'Valid Phone Number is Required');
                    }
                    return false;
                }
            }

            // check for custom rules
            if (rules.custom) {
                for (var newRule in rules.custom) {
                    if (newRule) {
                        LOG('new rule: ' + newRule);
                    }
                }
            }
            
        } else {
            LOG('  nothing in field');
            if (rules.errors != null && rules.errors.required != null) {
                EDContract.ShowFieldError(element, field, rules.errors.required);
            } else {
                EDContract.ShowFieldError(element, field, 'Required');
            }
            return false;
        }
        
        EDContract.ClearFieldError(element, field);
        return true;
    };

    EDContract.ShowElementError = function(element, error) {
        $(element.reference).addClass('error');
        $(element.errorContainer).html(error);
    };

    EDContract.ClearElementError = function(element) {
        $(element.reference).removeClass('error');
        $(element.errorContainer).html('');
    };

    EDContract.HasElementError = function(element) {
        return !$(element.errorContainer).is(':empty');
    };

    EDContract.ShowFieldError = function(element, field, error) {
        LOG('show error field: ');
        LOG(field);
        LOG(field.errorContainer);
        $(field).addClass('error');
        $(field.errorContainer).html(error).addClass('field-validation-error');
    };

    EDContract.ClearFieldError = function(element, field) {
        $(field).removeClass('error');
        $(field.errorContainer).html('').removeClass('field-validation-error').addClass('field-validation-valid');
    };

    EDContract.HasFieldError = function(element, field) {
        return !$(field.errorContainer).is(':empty');
    };
    
    /* Helper Functions
    === === === === === === === === === === === === === === === */
    // match element to DOM ID
    EDContract.SelectPageByID = function(ID) {
         for (var i = 0; i < EDContract.pages.length; i++) {
            if(ID === EDContract.pages[i].ID) {
                return EDContract.pages[i];
            }
        }
        return null;
    };
    
    // match element to DOM ID
    EDContract.SelectElementByID = function(ID) {
        for (var i = 0; i < EDContract.pages.length; i++) {
            var pageElements = EDContract.elements[i];
            for (var j = 0; j < pageElements.length; j++) {
                if(ID === EDContract.elements[i][j].ID) {
                    return EDContract.elements[i][j];
                }
            }
        }
        ERROR('Element not found');
        return null;
    };

    // return array of EDContract Elements
    EDContract.GetElementsByPage = function(page) {
        LOG('page' + page.key);
        var i,
            currElem,
            pageElements = EDContract.elements[page.key],
            elementsArray = [];

        for (i = 0; i < pageElements.length; i++) {
            currElem = EDContract.elements[page.key][i];
            if (currElem.checkable) {
                elementsArray.push( EDContract.IsElementSelected(currElem) );
            }
            
        }
        return elementsArray;
    };

    /* Events
    === === === === === === === === === === === === === === === */
    
} ());

// EDCNav
var EDCNav = EDCNav || {};

// vars
EDCNav.navs = [];
EDCNav.currentNavNum = 0;
EDCNav.startNavNum = 0;

(function () {
    "use strict"; //because javascript
    
    /* Navigation Functions
    === === === === === === === === === === === === === === === */

    // selector = jquery selector
    EDCNav.Construct = function(selector, currentNum) {
        if (typeof currentNum === 'number') {
            EDCNav.currentNavNum = currentNum;
        }
        $(selector).show();
        EDCNav.ID = $(selector).attr('id');
        EDCNav.reference = $(selector);
        EDCNav.UL = $(selector + ' ul');
        EDCNav.totalNavs = EDCNav.UL.children().length;             // Set total number of navs depending on DOM
        
        // set EDCNav.navs options
        for (var i = 0; i < EDCNav.totalNavs; i++) {
            var options = {
                key: i,                                             //key
                reference: $(EDCNav.UL).children()[i]              //jQuery reference
            };
            EDCNav.navs[i] = options;
        }
        EDCNav.UL.children('li').bind('click', function() {
            if (!$(this).hasClass('complete')) {
                return false;
            }
        });

        EDCNav.GoToNav(EDCNav.currentNavNum);
    };
    
    EDCNav.JoinToPage = function(pageID) {
        var p = EDContract.pages[pageID];

        for (var i = 0; i < EDCNav.totalNavs; i++) {
            var href = $(EDCNav.navs[i].reference).children('a').attr('href');

            if ('#'+p.ID === href) {
                EDCNav.navs[i].pageID = p.ID;
            }
        }

    };

    EDCNav.GoToNav = function(navNum) {
        $(document).scrollTop(0);
        
        LOG('Navigate: ' + navNum);
        // navigation
        var navEl = EDCNav.navs[navNum].reference;
        $(navEl).addClass('current');
        
        for (var i = 0; i < EDCNav.totalNavs; i++) {
            navEl = EDCNav.navs[i].reference;
            if (i < navNum) {
                $(navEl).removeClass('current').addClass('complete');
            }

            if (i > navNum) {
                $(navEl).removeClass('current');
            }
        }
        EDCNav.currentNavNum = navNum;
    };
    
    EDCNav.ShowPageError = function(page) {
        LOG('nav showpageerror ');
        LOG(page.ID);
        
        var navEl;
        for (var i = 0; i < EDCNav.totalNavs; i++) {
            if (page.ID == EDCNav.navs[i].pageID) {
                navEl = EDCNav.navs[i].reference;
            }
        }
        LOG(navEl);
        $(navEl).addClass('error');
    };
    EDCNav.ClearPageError = function(page) {
        LOG('nav claerpageerror ' + page.ID);
        var navEl;
        for (var i = 0; i < EDCNav.totalNavs; i++) {
            if (page.ID == EDCNav.navs[i].pageID) {
                navEl = EDCNav.navs[i].reference;
            }
        }
        LOG(navEl);
        //var navEl = EDCNav.navs[pageID].reference;
        $(navEl).removeClass('error');
    }

    EDCNav.GoToNavHash = function(hash) {
        for (var i=0; i < EDCNav.totalNavs; i++) {
            //LOG('nav pageid: ' + EDCNav.navs[i].pageID);
            if ('#'+EDCNav.navs[i].pageID === hash) {
                LOG('  goto nav: ' + EDCNav.navs[i].pageID);
                EDCNav.GoToNav(i);
            }
        }
    };

    EDCNav.ActivateNavNum = function(navNum) {
        for (var i = 0; i <= navNum; i++) {
            var navEl = EDCNav.navs[i].reference;
            $(navEl).addClass('complete');
        }
    };

} ());

function LOG(msg) {
    if (useLog) {
        console.log(msg);
    }
}
function ERROR(msg) {
    if (useLog) {
        console.error("EDC Error: "+msg);
    }
}


/*
    jQuery Validate helper function for partial forms
    Taken from: http://stackoverflow.com/questions/2636512/validate-subset-of-a-form-using-jquery-validate-plugin

jQuery.validator.prototype.subset = function(container) {
    var ok = true;
    var self = this;
    $(container).find(':input').each(function() {
        if (!self.element($(this))) {
            ok = false;
        }
    });
    return ok;
};*/
/*
    Array prototype indexof 
    Taken from: http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
*/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}


// handle Exhibit navigation based on # changes
$(window).bind('hashchange', function () {
    var gotopage = 0;
    for (var i = 0; i < EDContract.totalPages; i++) {
        if (window.location.hash === '#'+EDContract.pages[i].ID) {
            gotopage=i;
        }
    }
    EDContract.GoToPage(gotopage);

    var gotonav = 0;
    for (var j = 0; j < EDCNav.totalNavs; j++) {
        if (EDCNav.navs[j].pageID === EDContract.pages[gotopage].ID) {
            gotonav = j;
        }
    }
    EDCNav.GoToNav(gotonav);
});

// zipsearch module
var ZipSearch = function () {
    var public = {},
        ZipLookupCities = [],
        zs = {
            loaderSelector: '',
            cancelSelector: '',
            messageSelector: '',
            zipSelector: '',
            cityTextboxSelector: '',
            cityDropdownSelector: '',
            otherCitySelector: '',
            listCitySelector: '',
            stateSelector: ''
        };

    public.init = function (selectors) {
        $.extend(true, zs, selectors);

        public.ActivateControls();

        if ($(zs.cityTextboxSelector).val().length > 0) {
            public.ShowCityTextbox();
        }
    };

    public.ActivateControls = function () {
        $(zs.loaderSelector).hide();
        $(zs.messageSelector).hide();
        $(zs.cityTextboxSelector).hide();

        $(zs.cityDropdownSelector).show();
        $(zs.listCitySelector).hide();
        $(zs.otherCitySelector).css('display', 'block');

        $(zs.zipSelector).bind('change', function () {
            var itemVal = $(this).val();
            if (itemVal.length >= 5) {
                handleZipSearch(itemVal);
            } else {
                ZipLookupCities = [];
                $(zs.cityDropdownSelector).children('option').remove();
            }
        });

        $(zs.cityDropdownSelector).bind('change', function () {
            $(zs.cityTextboxSelector).val($(this).val());
        });

        $(zs.otherCitySelector).bind('click', function () {
            if ($(zs.cityTextboxSelector).css('display') == 'none') {
                public.ShowCityTextboxAndFocus();
            }
        });

        $(zs.listCitySelector).bind('click', function () {
            if ($(zs.cityDropdownSelector).css('display') == 'none') {
                public.ShowCityDropdown();
            }
        });

        $(zs.cancelSelector).bind('click', function () {
            $(zs.otherCitySelector).trigger('click');
            $(zs.loaderSelector).hide();
            $(zs.messageSelector).hide();
        });
    };

    public.DeactivateControls = function () {
        $(zs.zipSelector).unbind('keyup change');
        $(zs.cityDropdownSelector).unbind('change');
        $(zs.otherCitySelector).unbind('click').hide();
        $(zs.listCitySelector).unbind('click').hide();

    };


    public.ShowCityTextbox = function () {
        $(zs.cityTextboxSelector).show(); //.focus();
        $(zs.cityDropdownSelector).hide();

        $(zs.otherCitySelector).hide();
        $(zs.listCitySelector).css('display', 'block');
    };

    public.ShowCityTextboxAndFocus = function () {
        $(zs.cityTextboxSelector).show().focus();
        $(zs.cityDropdownSelector).hide();

        $(zs.otherCitySelector).hide();
        $(zs.listCitySelector).css('display', 'block');
    };

    public.ShowCityDropdown = function () {
        $(zs.cityDropdownSelector).show(); //.focus();
        $(zs.cityTextboxSelector).val($(zs.cityDropdownSelector).val()).hide();

        $(zs.listCitySelector).hide();
        $(zs.otherCitySelector).css('display', 'block');
    };


    function handleZipSearch(zipcode) {
        $(zs.messageSelector).hide();
        $(zs.loaderSelector).show();

        $.getJSON('https://api.smartystreets.com/zipcode?zipcode='+zipcode+'&auth-token=4703327053525490354', function (data) {
            // clear already listed values            
            ZipLookupCities = [];
            $(zs.cityDropdownSelector).children('option').remove();

            if (data.length > 0) {
                //var obj = JSON.parse(data);
				var obj = data;
				
                if (obj[0].status == "invalid_zipcode") {
                    $(zs.messageSelector).show().children('span').html('Error: invalid zipcode');
                } else {
                    $.each(obj[0].city_states, function (index, item) {
                        ZipLookupCities.push(item.city);

                        $(zs.stateSelector).val(item.state_abbreviation);
                    });
                }
            } else {
                $(zs.messageSelector).show().children('span').html('Error with connection. Try again or dismiss.');
            }
        })
        .success(function () {
            //console.log('second success');
        })
        .error(function (msg) {
            //console.log("error");
            $(zs.messageSelector).show().children('span').html('Error: ' + msg);
        })
        .complete(function () {
            //console.log("complete");
            $(zs.loaderSelector).hide();

            $.each(ZipLookupCities, function (index, item) {
                $('<option value="' + item + '">' + item + '</option>').appendTo($(zs.cityDropdownSelector));
            });
            public.ShowCityDropdown();
            $(zs.cityDropdownSelector).change();
        });
    }

    return public;
}