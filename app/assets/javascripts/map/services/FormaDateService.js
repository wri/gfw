define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/FormaService',
], function (Class, UriTemplate, moment, _, FormaService) {

  'use strict';

  var MIN_DATE = '2012-01-01';
  var STEP = 16;

  var FormaDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
    },

    fetchMaxDate: function() {
      FormaService
    },

    fetchDates: function() {
      var deferred = new $.Deferred();

      FormaService.getTileUrl()
        .then(function(tile) {
          FormaService.getDates()
            .then(function(data) {
              var startDate = moment.utc(MIN_DATE, 'YYYY-MM-DD');
              var endDate = moment.utc(tile.date, 'YYYY-MM-DD');
              var years = _.range(startDate.year(), endDate.year() + 1);
              var counts = {};

              for (var year in data) {
                var start = moment.utc(year, 'YYYY').startOf('year');
                var end = moment.utc(year, 'YYYY').endOf('year');
                var current = moment.utc().year(year).startOf('year');
                var numDays = end.diff(start, 'days') + 1;

                counts[year] = [];
                for (var index = 0; index < numDays; index++) {
                  var currentDay = current.format('YYYY-MM-DD');

                  if (data[year].indexOf(currentDay) !== -1) {
                    counts[year].push(true);
                  } else {
                    counts[year].push(false);
                  }
                  currentDay = current.add(1, 'days');
                }
              }

              deferred.resolve({
                minDate: MIN_DATE,
                maxDate: tile.date,
                counts: counts
              });
            })
        });

      return deferred.promise();
    }

  });

  return FormaDateService;

});
