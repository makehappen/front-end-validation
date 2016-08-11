/**
 * Validate Class
 * requires utils.js
 * requires credit-card.js
 * */
var validate = (function(config){

    // set default style classes
    var errorClass = ('undefined' != typeof config && 'undefined' != typeof config.errorClass) ? config.errorClass : 'has-error';
    var successClass = ('undefined' != typeof config && 'undefined' != typeof config.successClass) ? config.successClass : 'has-success';

    // set variables with class scope
    var self = this;
    var validationClass = '';

    // instantiate helper classes
    $(document).ready(function(){
        self.utils  = new utils();
        self.card   = new creditCard(config);
    });

    /**
     * Validate Form
     * */
    this.form = (function(objForm) {

        var strError = '';

        // lookup fields to be validated
        var arrFields = $(objForm).find('[validation],[required]');

        // create errors bucket
        var arrErrors = [];

        // validate fields
        $.each(arrFields, function(index, item){
            strError = self.field(item);
            if(strError){
                arrErrors.push(strError);
                self.utils.addValidationClass(item, errorClass);
            }
        });

        // deal with errors
        if(arrErrors.length){

            var $objModal = $('#bs-modal');
            var objModalTitle = $objModal.find('.modal-title');
            var objModalContent = $objModal.find('.modal-body');

            var strErrors = '';
            objModalTitle.html('Please correct input');

            // create errors list
            for(var i=0; i < arrErrors.length; i++){
                strErrors += '<li>' + arrErrors[i] + '</li>';
            }

            // display errors
            objModalContent.html(strErrors);

            // open modal with errors
            $objModal.modal('show').on('hidden.bs.modal', function() {
                objModalTitle.text('Message');
                objModalContent.text('');
            });

            return false;
        }

        return (strError) ? false : true;
    });

    /**
     * Validate Field
     * */
    this.field = (function(objField, blnFilter) {

        var blnFilter = (typeof blnFilter !== 'undefined') ? blnFilter : false;
        var strError = '';
        var validationType = $(objField).attr('validation');

        if (
            !validationType
            && $(objField).attr('required')
            && $(objField).attr('name') == 'credit_card_number'
        ){
            validationType = 'credit_card_number';
        }

        if (
            !validationType
            && $(objField).attr('required')
            && $(objField).attr('name') == 'cvv'
        ){
            validationType = 'cvv';
        }

        if (
            !validationType
            && $(objField).attr('type')
        ){
            validationType = $(objField).attr('type');
        }

        var fieldValue = $(objField).val();

        // ignore hidden fields
        if ($(objField).attr('type') == 'hidden'){
            return;
        }

        var strFieldLabel = $('label[for="' + $(objField).attr('name') + '"]').text();
        strFieldLabel = strFieldLabel.replace(/\*/g, '');

        if (!strFieldLabel){
            strFieldLabel =
                ($(objField).attr('title') && !$(objField).hasClass('has-error'))
                    ? $(objField).attr('title')
                    : self.utils.fieldNameToString($(objField).attr('name'));
        }

        if (
            $(objField).attr('required')
            && (
                !fieldValue
                || (
                    $(objField).attr('type') == 'checkbox' && !$(objField).is(':checked')
                )
            )
        ){
            self.utils.addValidationClass(objField, errorClass);
            return '"' + strFieldLabel + '" is a required field';

        }

        if (!fieldValue){
            return;
        }

        var regex = '';
        switch(validationType){

            case 'email':
                regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                validationClass = (regex.test(fieldValue)) ? successClass : errorClass;
                strError = (regex.test(fieldValue)) ? '' : 'The email address appears to be invalid';
                break;

            case 'url':
                regex = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>#%",\{}\\|\\\^\[\]`]+)?$/;
                validationClass = (regex.test(fieldValue)) ? successClass : errorClass;
                strError = (regex.test(fieldValue)) ? '' : 'The URL appears to be invalid';
                break;

            case 'domain':
                regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
                validationClass = (regex.test(fieldValue)) ? successClass : errorClass;
                strError = (regex.test(fieldValue)) ? '' : 'The domain name appears to be invalid';
                break;

            case 'ip':
                regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                validationClass = (regex.test(fieldValue)) ? successClass : errorClass;
                strError = (regex.test(fieldValue)) ? '' : 'The IP appears to be invalid';
                break;

            case 'number':
            case 'int':
                if (blnFilter){
                    fieldValue = fieldValue.replace(/\D/,'');
                    $(objField).val(fieldValue);
                }
                validationClass = (fieldValue % 1 === 0) ? successClass : errorClass;
                strError = (fieldValue % 1 === 0) ? '' : 'The value does not appear to be a valid number';
                break;

            case 'float':
                validationClass = (!isNaN(fieldValue) && fieldValue.toString().indexOf('.') != -1) ? successClass : errorClass;
                strError = (!isNaN(fieldValue) && fieldValue.toString().indexOf('.') != -1) ? '' : 'The number is not a float/decimal';
                break;

            case 'date':
                regex = /(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:19|20\d{2})/;
                validationClass = (regex.test(fieldValue)) ? successClass : errorClass;
                strError = (regex.test(fieldValue)) ? '' : 'Invalid date (required format: mm/dd/yyyy)';
                break;

            case 'credit_card_number':
                var blnValid = self.card.validateNumber(objField);
                validationClass = (blnValid) ? successClass : errorClass;
                strError = (blnValid) ? '' : 'Invalid Credit Card Number';
                break;

            case 'cvv':
                var cardType = self.card.getCardType($('input[name="credit_card_number"]').val());
                cardType = cardType ? cardType : self.card.getCardType($('input[name="cc_number"]').val());
                if (cardType == 'AMEX'){
                    validationClass = (fieldValue.length == 4) ? successClass : errorClass;
                    strError = (fieldValue.length == 4) ? '' : 'AMEX CVV must be a 4 digit security code';
                } else if(cardType) {
                    validationClass = (fieldValue.length == 3) ? successClass : errorClass;
                    strError = (fieldValue.length == 3) ? '' : 'Card CVV must be a 3 digit security code';
                }
                break;
        }

        // min length
        var blnError = $(objField).attr('minlength') && fieldValue.length < $(objField).attr('minlength');
        if (!strError){
            validationClass = (blnError) ? errorClass : '#00b9e4';
            strError = (blnError) ? 'Minimum length required for ' + strFieldLabel + ' is: ' + $(objField).attr('minlength') : '';
        }

        // max length
        blnError = $(objField).attr('maxlength') && fieldValue.length > $(objField).attr('maxlength');
        if (!strError){
            validationClass = (blnError) ? errorClass : successClass;
            strError = (blnError) ? 'Maximum length required for ' + strFieldLabel + ' is: ' + $(objField).attr('maxlength') : '';
        }

        if (validationClass){
            self.utils.addValidationClass(objField, validationClass, errorClass, successClass);
        }

        return strError;
    });
});