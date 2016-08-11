/**
 * Utils Class
 * */
var utils = (function(){
    this.isDeleteOrBackspaceKey = (function(event) {
        var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
        return charCode == 8 || charCode == 46;

    });

    this.isNumericalKey = (function(event) {
        var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
        return charCode >= 48 && charCode <= 57;

    });
    this.fieldNameToString = (function(strName){
        if (typeof strName !== 'undefined'){
            strName = strName.replace(/_/g, ' ');
            strName = strName.replace(/\[]/g, ''); // array fields
            return this.ucwords(strName);
        }
    });

    this.ucwords = (function(strValue) {
        return (strValue + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    });

    this.addValidationClass = (function (item, validationClass, errorClass, successClass) {
        $(item).removeClass(errorClass);
        $(item).removeClass(successClass);
        $(item).closest('.input-group').removeClass(errorClass);
        $(item).closest('.input-group').removeClass(successClass);

        $(item).addClass(validationClass);
        $(item).closest('.input-group').addClass(validationClass);
    });
});
