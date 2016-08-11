/**
 * Event Listeners
 * Requires:
 *  utils.js
 *  validate.js
 * */
var eventListeners = (function(config){

    // set defaults
    var arrNumericalFields =
        ('undefined' != typeof config && 'undefined' != typeof config.arrNumericalFields)
            ? config.arrNumericalFields
            : [
            'input[name="credit_card_number"]',
            'input[name="cvv"]',
            'input[validation="int"]'
        ];

    // set variables with class scope
    var self = this;
    var blnErrors = false;

    // instantiate helper classes
    $(document).ready(function(){
        self.utils  = new utils();
        self.validate   = new validate();
    });

    // validate fields on blur
    this.validateField = (function(){
        $(document).on('blur','form input',function(event){
            self.validate.field(this, 'filter');
        });
    });

    // validate fields on keyup
    $(document).on('keyup','form input.keyup-validation',function(event){
        if (self.utils.isDeleteOrBackspaceKey(event)) {
            return;
        }
        self.validate.field(this, 'filter');
    });

    // validate select
    this.validateSelect = (function(){
        $(document).on('change','form select',function(){
            self.validate.field(this);
        });
    });

    // validate numerical values
    this.validateNumerical = (function(){
        $.each(arrNumericalFields, function(index, field){
            $(document).on('keyPress', field, function(event){
                return self.utils.isDeleteOrBackspaceKey(event) || self.utils.isNumericalKey(event)
            });
        });
    });

    // cvv info
    this.cvvInfo = (function(){
        $(document).on('click', 'a.cvv-popover', function(e) {
            e.preventDefault();
            $(this).popover();
        });
    });

    // validate form
    this.validateForm = (function(){
        $(document).on('submit','form',function(e){
            if ($(this).hasClass('modal-form') || $(this).hasClass('no-submit-disable')){
                return;
            }
            if (!self.validate.form(this)) {
                blnErrors = true;
                e.preventDefault();
                $(this).find('button').last().prop('disabled', false);
                $(this).find('input[type="submit"]').prop('disabled', false);
                $('#disable-page-processing').hide()
            } else {
                blnErrors = false;
                $('#disable-page-processing').fadeIn();
                $(this).find('button').last().prop('disabled', true).text('Processing...');
                $(this).find('input[type="submit"]').prop('disabled', true);
            }
        });
    });
});