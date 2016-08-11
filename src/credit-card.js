/**
 * Credit Cards Validation Class
 * requires utils.js
 * */
var creditCard = (function(config){

    // set default style classes
    var errorClass = ('undefined' != typeof config && 'undefined' != typeof config.errorClass) ? config.errorClass : 'has-error';
    var successClass = ('undefined' != typeof config && 'undefined' != typeof config.successClass) ? config.successClass : 'has-success';

    // set variables with class scope
    var self = this;

    // instantiate helper classes
    $(document).ready(function(){
        self.utils  = new utils();
    });

    this.validateNumber = (function(ccField) {

        var $cardType = $('#card-type');
        var $ccField = $(ccField);

        $ccField.removeClass('has-error').removeClass('has-success');
        $cardType.removeClass('visa').removeClass('mc').removeClass('amex').text('');

        if($(ccField).val().length < 2){
            $cardType.removeClass('card').addClass('cards');
            return;
        }

        var cardType = this.getCardType($(ccField).val());

        var ccNumber = $(ccField).val();
        ccNumber = ccNumber.replace(/\s|-/g, '');

        switch(cardType){
            case 'Visa':
                $cardType.removeClass('cards').addClass('card visa');
                $ccField.val(this.formatCreditCard(ccNumber,cardType));
                break;

            case 'Mastercard':
                $cardType.removeClass('cards').addClass('card mc');
                $ccField.val(this.formatCreditCard(ccNumber,cardType));
                break;

            case 'AMEX':
                $cardType.removeClass('cards').addClass('card amex');
                $ccField.val(this.formatCreditCard(ccNumber,cardType));
                break;

            default:
                $cardType.removeClass('cards');
                $ccField.attr('placeholder', 'Visa, MC, or Amex');
                self.utils.addValidationClass(ccField, errorClass);
        }

        var cardLength = (cardType == 'AMEX') ? 15 : 16;
        if(ccNumber.length >= cardLength){

            if (this.validateCardCheckSum($ccField.val())){
                self.utils.addValidationClass(ccField, successClass);
                return true;
            } else {
                self.utils.addValidationClass(ccField, errorClass);
                return false;
            }

        } else {
            return true;
        }
    });

    this.formatCreditCard = (function(ccNumber,type) {
        var firstFour = ccNumber.substring(0,4);
        var secondFour = '';
        var thirdFour = '';
        var lastFour = '';

        if (ccNumber.length >= 4){
            if(type == 'AMEX'){
                secondFour = ' - ' + ccNumber.substring(4,(ccNumber.length <= 10) ? ccNumber.length : 10);
            } else {
                secondFour = ' - ' + ccNumber.substring(4,(ccNumber.length <= 8) ? ccNumber.length : 8);
            }
        }
        if (ccNumber.length >= ((type == 'AMEX') ? 10 : 8)){
            if(type == 'AMEX'){
                thirdFour = ' - ' + ccNumber.substring(10,(ccNumber.length <= 15) ? ccNumber.length : 15);
            } else {
                thirdFour = ' - ' + ccNumber.substring(8,(ccNumber.length <= 12) ? ccNumber.length : 12);
            }
        }
        if (ccNumber.length >= 12 && type != 'AMEX'){
            if(type == 'AMEX'){
                lastFour = ''
            } else {
                lastFour = ' - ' + ccNumber.substring(12,(ccNumber.length <= 16) ? ccNumber.length : 16);
            }
        }

        return firstFour + secondFour + thirdFour + lastFour;
    });

    this.getCardType = (function(number) {

        if (!number) {
            return;
        }

        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null)
            return "Visa";

        // Mastercard
        re = new RegExp("^5[1-5]");
        if (number.match(re) != null)
            return "Mastercard";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null)
            return "AMEX";

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) != null)
            return "Discover";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null)
            return "Diners";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null)
            return "Diners - Carte Blanche";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null)
            return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null)
            return "Visa Electron";

        return "";
    });

    this.validateCardCheckSum = (function(ccNumber) {
        ccNumber = ccNumber.replace(/\s|-/g, '');

        var reverseNumber = ccNumber.split('').reverse().join('');

        var temp = "";
        for (i = 0; i < reverseNumber.length; i++) {
            var currentNumber = parseInt(reverseNumber.charAt(i), 10);
            if (i % 2 != 0){
                currentNumber *= 2;
            }
            temp = temp + currentNumber;
        }

        var checkSum = 0;
        for (i = 0; i < temp.length; i++) {
            currentNumber = parseInt(temp.charAt(i), 10);
            checkSum = checkSum + currentNumber;
        }

        return (checkSum != 0 && checkSum % 10 == 0);
    });
});
