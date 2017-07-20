define([
  'underscore'
], function(_) {

  var numbersHelper = {
    /**
     * Returns a number with its decimals
     *
     * @param  {Number} Number to format
     * @return {string} String
     */
    addNumberDecimals: function(number) {
      var formattedNumber = '-';

      if (number) {
        if (number > 1) {
          formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          formattedNumber = number;
        }
      }
      return formattedNumber;
    },

    /**
     * Returns a number clipped and with the k unit if its > of a thousand
     *
     * @param  {Number} Number to format
     * @return {string} String
     */
    toThousands: function(number) {
      return number > 999 ? (number/ 1000).toFixed(1) + 'k' : (number * 1).toFixed(2);
    },

    padNumberToTwo: function(number) {
      return ("0" + number.toString()).slice(-2);
    },

    round: function(number, decimals) {
      var result = number;
      if (number) {
        var toDecimals = decimals || 2;
        result = parseFloat((number * 1).toFixed(toDecimals));
        if (result > 1) {
          result = Math.round(result);
        }
      }
      return result;
    }
  };

  return numbersHelper;
});
