define([
  'Class', 'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var REQUEST_ID = 'CartoDbLayerService:fetchLayerConfig';

  var URL = 'https://wri-01.carto.com/api/v1/map?stat_tag=API';

  var CartoDbLayerService = Class.extend({

    init: function(sql, cartocss) {
      this.config = {
        version: "1.2.0",
        layers: [{
          type: "cartodb",
          options: {
            sql: sql,
            cartocss: cartocss,
            cartocss_version: "2.3.0"
          }
        }]
      };

      this._defineRequests();
    },

    _defineRequests: function() {
      var config = {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      };

      ds.define(REQUEST_ID, config);
    },

    fetchLayerConfig: function() {
      var deferred = new $.Deferred();

      var config = {
        resourceId: REQUEST_ID,
        data: JSON.stringify(this.config),
        success: deferred.resolve,
        error: deferred.reject
      };

      ds.request(config);

      return deferred.promise();
    }

  });

  return CartoDbLayerService;

});
