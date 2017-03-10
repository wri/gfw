define([
  'Class', 'uri', 'moment', 'underscore',
  'services/DataService'
], function (Class, UriTemplate, moment, _, ds) {

  'use strict';

  var REQUEST_ID = 'TerraiDateService:fetchDates';

  var URL = window.gfw.config.GFW_API_HOST_NEW_API + "/terrai-alerts/latest";

  var TerraiDateService = Class.extend({

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
        deferred.resolve(_.pick(data, 'minDate', 'maxDate', 'counts'));
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

  return TerraiDateService;

});
