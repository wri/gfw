define([
  'moment',
], function(moment) {

  'use strict';

  var AVAILABLE_DATE_RANGES = [{
    start: moment.utc('1997-01-01'),
    end: moment.utc('2010-12-31'),
    label: '1997-2010',
    duration: 0
  }, {
    start: moment.utc('2010-01-01'),
    end: moment.utc('2015-12-31'),
    label: '2010-2015',
    duration: 0
  }];

  return {
    getRangeForDates: function(dates) {
      return [moment.utc('1997-01-01'), moment.utc('2010-12-31')];
    },

    dateRanges: AVAILABLE_DATE_RANGES
  };

});
