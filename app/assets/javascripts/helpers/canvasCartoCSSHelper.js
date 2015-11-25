define([
  'moment',
  'text!map/cartocss/default_canvas_style.cartocss'
], function(moment, defaultCss) {

  var canvasCartoCSSHelper = {

    generateDaily: function(columnName, startDate, endDate) {
      var CONFIDENCE_VALUES = [2,3,null];

      startDate = moment(startDate);
      endDate = moment(endDate);

      var rules = [];

      var currDate = startDate.clone().startOf('day');
      while(currDate.diff(endDate) < 1) {
        var formattedDate = currDate.format('YYYY-MM-DD');

        CONFIDENCE_VALUES.forEach(function(confidence) {
          var rule = {
            date: formattedDate,
            confidence: confidence
          };

          var dayOfYear = currDate.dayOfYear();
          if (dayOfYear > 255) {
            rule.rgb = "0, " + (dayOfYear % 255) + ", " + (confidence || 0) + ", 1";
          } else {
            rule.rgb = dayOfYear + ", 0, " + (confidence || 0) + ", 1";
          }

          rules.push(rule);
        });

        currDate = currDate.add('days', 1);
      }

      var formattedRules = rules.map(function(rule) {
        if (rule.confidence !== null) {
          rule.confidence = '"'+rule.confidence+'"';
        }

        return [
          "[date=\"" + rule.date + "\"]",
          "[confi=" + rule.confidence + "] {",
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
