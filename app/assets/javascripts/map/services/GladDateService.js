define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/DataService'
], function (Class, UriTemplate, moment, _, ds) {

  'use strict';

  var REQUEST_ID = 'GladDateService:fetchDates';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = '393cb17c-be09-4868-914e-b50f7f5ec0b5';
  var QUERY = '/query?sql=SELECT count(*) as alerts FROM {dataset} GROUP BY julian_day, year ORDER BY year, julian_day';

  var GladDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        dataset: DATASET
      });

      var config = {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: url,
        type: 'GET'
      };

      ds.define(REQUEST_ID, config);
    },

    fetchDates: function() {
      var deferred = new $.Deferred();

      var onSuccess = function(result) {
        var data = result && result.data ? result.data : [];
        var dates = {
          counts: null,
          minDate: null,
          maxDate: null
        };

        if (data.length > 0) {
          var groupedDates = _.groupBy(data, 'year');
          var years = _.keys(groupedDates);
          var dataByYear = [];

          var startDay = groupedDates[years[1]];
          var startDate = moment.utc()
            .year(years[0])
            .dayOfYear(startDay[0].julian_day);

          var endDay = groupedDates[years[years.length - 1]];
          var endDate = moment.utc()
            .year(years[years.length - 1])
            .dayOfYear(endDay[endDay.length - 1].julian_day);

          _.each(groupedDates, function(data, year) {
            dataByYear[year] = _.pluck(data, 'julian_day');
          });

          dates.counts = dataByYear;
          dates.minDate = startDate.format('YYYY-MM-DD');
          dates.maxDate = endDate.format('YYYY-MM-DD');
        }

        deferred.resolve(dates);
      };

      var config = {
        resourceId: REQUEST_ID,
        success: onSuccess,
        error: deferred.reject
      };

      ds.request(config);

      return deferred.promise();
    }

  });

  return GladDateService;

});
