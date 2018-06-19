define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/DataService'
], function (Class, UriTemplate, moment, _, ds) {

  'use strict';

  var REQUEST_ID = 'GladDateService:fetchDates';

  var API = window.gfw.config.GFW_API;

  var GladDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests: function() {
      var url = API + '/glad-alerts/latest';

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
        var date = result && result.data && result.data[0] ? result.data[0].attributes.date : [];
        var dates = {
          counts: null,
          minDate: null,
          maxDate: null
        };
        if (date) {
          dates.minDate = '2015-01-01';
          dates.maxDate = date;
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
