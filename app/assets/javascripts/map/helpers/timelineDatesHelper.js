define([
  'moment',
], function(moment) {

  'use strict';

  var AVAILABLE_DATE_RANGES = [{
    start: moment().subtract(7, 'days').utc(),
    end: moment().utc(),
    label: 'past week',
    duration: 24 * 7
  }, {
    start: moment().subtract(3, 'days').utc(),
    end: moment().utc(),
    label: 'past 72 hours',
    duration: 72
  }, {
    start: moment().subtract(2, 'days').utc(),
    end: moment().utc(),
    label: 'past 48 hours',
    duration: 48
  }, {
    start: moment().subtract(1, 'days').utc(),
    end: moment().utc(),
    label: 'past 24 hours',
    duration: 24
  }];

  return {
    getRangeForDates: function(dates, range) {
      var filterDates = [dates[0], dates[1]];
      var dateRange = range ? range : AVAILABLE_DATE_RANGES;

      var duration = moment(dates[1]).diff(moment(dates[0]), 'hours'),
          dateRange = _.findWhere(dateRange, {duration: duration});

      if (dateRange) {
        filterDates = [dateRange.start, dateRange.end];
      }

      return filterDates;
    },

    dateRanges: function(range) {
      if (range) {
        return range;
      }
      return AVAILABLE_DATE_RANGES;
    }
  };

});
