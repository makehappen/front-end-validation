/**
 * Front End Validation Class
 * @auth florin@makeppen.com
 * Requires:
 *  jquery-1.12.0.min.js
 *  bootstrap.min.js
 *  bootstrap.min.css
 *  utils.js
 *  credit-card.js
 *  validate.js
 * */
var frontEndValidation = (function(config) {

    // set variables with class scope
    var self = this;

    // init function
    $(document).ready(function(){
        self.initiateEventListeners();
    });

    /**
     * Initiate event listeners
     * */
    this.initiateEventListeners = (function(){

        var objEventListeners = new eventListeners(config);

        // validate field
        objEventListeners.validateField();

        // validate select
        objEventListeners.validateSelect();

        // only allow numerical values on certain fields
        objEventListeners.validateNumerical();

        // cvv info
        objEventListeners.cvvInfo();

        // form validation
        objEventListeners.validateForm();

    });
});
