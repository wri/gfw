define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/DataService'
], function (Class, UriTemplate, moment, _, ds) {

  'use strict';

  var REQUEST_ID = 'GladDateService:fetchDates';

  var URL = window.gfw.config.GFW_API_HOST_NEW_API + "/glad-alerts/latest";

  var GladDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests: function() {
      var config = {
        cache: false,
        url: URL,
        type: 'GET'
      };

      ds.define(REQUEST_ID, config);
    },

    fetchDates: function() {
      var deferred = new $.Deferred();

      var onSuccess = function(result) {
        var data = result.data && result.data.attributes ?
          result.data.attributes : [];
        deferred.resolve(_.pick(data, 'max-date', 'counts'));
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
