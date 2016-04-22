var isInArray = function (value, array) {
    return array.indexOf(value) > -1;
}

var isNumberKey = function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    if (evt.currentTarget.value.length > 1) {
        return false;
    };
    return true;
}

var getTodaysDatePlusDays = function (daysToAdd) {
    var date = new Date();
    var today = date.getDate();
    var returns = date.setDate(today + daysToAdd);
    return returns;
};