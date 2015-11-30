define([
  'moment',
  'text!map/cartocss/default_canvas_style.cartocss'
], function(moment, defaultCss) {

  var canvasCartoCSSHelper = {

    generateDaily: function(columnName, startDate, endDate) {
      startDate = moment(startDate);
      endDate = moment(endDate);

      var rules = [];

      var currDate = startDate.clone().startOf('day');
      while(currDate.diff(endDate) < 1) {
        var formattedDate = currDate.format('YYYY-MM-DD');

        var rule = {
          date: formattedDate
        };

        var dayOfYear = currDate.dayOfYear();
        if (dayOfYear > 255) {
          rule.rgb = "0, " + (dayOfYear % 255) + ", 0, 1";
        } else {
          rule.rgb = dayOfYear + ", 0, 0, 1";
        }

        rules.push(rule);

        currDate = currDate.add('days', 1);
      }

      var formattedRules = rules.map(function(rule) {
        return [
          "[date=\"" + rule.date + "\"] {",
          "  marker-fill: rgba(" + rule.rgb + ");",
          "}"
        ].join(" ");
      });

      var css = [
        "#layer {",
          defaultCss.replace(/(\r\n|\n|\r)/gm,""),
          formattedRules.join(" "),
        "}"
      ].join(" ");

      return css;
    }

  };

  return canvasCartoCSSHelper;

});
