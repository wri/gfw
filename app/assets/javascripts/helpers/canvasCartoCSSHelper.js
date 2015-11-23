define([
  'moment'
], function(moment) {

  var canvasCartoCSSHelper = {

    generateDaily: function(columnName, startDate, endDate) {
      var css = "#layer { marker-width: 1; marker-line-width: 0; marker-allow-overlap: true;";

      startDate = moment(startDate);
      endDate = moment(endDate);

      var currDate = startDate.clone().startOf('day');
      while(currDate.diff(endDate) < 1) {
        var formattedDate = currDate.format('YYYY-MM-DD'),
            dayOfYear = currDate.dayOfYear();

        var rgb;
        if (dayOfYear > 255) {
          rgb = "0, " + (dayOfYear % 255) + ", 0, 1";
        } else {
          rgb = dayOfYear + ", 0, 0, 1";
        }

        css += " [date=\"" + formattedDate + "\"] { marker-fill: rgba(" + rgb + "); }";

        currDate = currDate.add('days', 1);
      }

      css += " }";
      return css;
    }

  };

  return canvasCartoCSSHelper;

});
