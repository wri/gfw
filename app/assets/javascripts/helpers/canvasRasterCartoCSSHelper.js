define([
  'moment',
  'text!map/cartocss/default_raster_canvas_style.cartocss'
], function(moment, defaultCss) {

  'use strict';

  var canvasCartoCSSHelper = {

    generateDaily: function(columnName, startDate, endDate) {
      startDate = moment(startDate);
      endDate = moment(endDate);

      var rules = [];

      var currDate = startDate.clone().startOf('day');
      while(currDate.diff(endDate) < 1) {
        var yearOffset = currDate.year() - 2015;
        var dayOfYear = currDate.dayOfYear();
        if (dayOfYear > 255) {
          rules.push('stop(' + (dayOfYear + (yearOffset * 365)) + ', rgba(0, ' + (dayOfYear % 255) + ', ' + yearOffset + ', 1))');
        } else {
          rules.push('stop(' + (dayOfYear + (yearOffset * 365)) + ', rgba(' + dayOfYear + ', 0, ' + yearOffset + ', 1))');
        }

        currDate = currDate.add('days', 1);
      }

      var css = [
        '#layer {',
          defaultCss.replace(/(\r\n|\n|\r)/gm,''),
        '}'
      ].join(' ');

      return css;
    }

  };

  return canvasCartoCSSHelper;

});
