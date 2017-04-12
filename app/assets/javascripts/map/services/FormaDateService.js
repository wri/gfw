define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/FormaService',
], function (Class, UriTemplate, moment, _, FormaService) {

  'use strict';

  var MIN_DATE = '2012-01-01';

  var FormaDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
    },

    fetchDates: function() {
      var deferred = new $.Deferred();

      FormaService.getTileUrl()
        .then(function(data) {
          var startDate = moment.utc(MIN_DATE, 'YYYY-MM-DD');
          var endDate = moment.utc(data.date, 'YYYY-MM-DD');
          var years = _.range(startDate.year(), endDate.year() + 1);
          var counts = {};
          years.forEach(function(year) {
            var start = moment.utc(year, 'YYYY').startOf('year');
            var end = moment.utc(year, 'YYYY').endOf('year');
            var numDays = end.diff(start, 'days') + 1;
            counts[year] = [];
            var count = 0;
            for (var index = 0; index < numDays; index++) {
              if (count === 15) {
                counts[year].push(true);
                count = 0;
              } else {
                counts[year].push(false);
                count ++;
              }
            }
          })
          deferred.resolve({
            minDate: MIN_DATE,
            maxDate: data.date,
            counts: counts
          });
        })

      return deferred.promise();
    }

  });

  return FormaDateService;

});
