define([
  'Class', 'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var REQUEST_ID = 'CartoDbLayerService:fetchLayerConfig';

  var CartoDbLayerService = Class.extend({

    init: function(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests: function() {
      var config = {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: this._getUrl(),
        type: 'POST',
        dataType: 'jsonp'
      };

      ds.define(REQUEST_ID, config);
    },

    _getUrl: function() {
      var url = 'http://wri-01.cartodb.com/api/v1/map?stat_tag=API';

      return url;
    },

    fetchLayerConfig: function() {
      var deferred = new $.Deferred();

      var config = {
        resourceId: REQUEST_ID,
        data: this.options.config,
        success: deferred.resolve,
        error: deferred.reject
      };

      debugger
      ds.request(config);

      return deferred.promise();
    }

  });

  return CartoDbLayerService;

});
