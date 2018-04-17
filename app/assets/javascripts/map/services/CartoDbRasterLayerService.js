define([
  'Class', 'bluebird',
  'map/services/DataService'
], function (Class, Promise, ds) {

  'use strict';

  var MAP_REQUEST_ID = 'CartoDbLayerService:fetchRasterLayerMap';
  var MAP_URL = 'https://wri-01.carto.com/api/v1/map?stat_tag=API';

  var CartoDbRasterLayerService = Class.extend({

    init: function(sql, cartocss) {
      this.sql = sql;
      this.cartocss = cartocss;

      this._defineRequests();
    },

    _defineRequests: function() {
      ds.define(MAP_REQUEST_ID, {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: MAP_URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      });
    },

    fetchLayerConfig: function() {
      return new Promise(function(resolve, reject) {

      var layerConfig = {
        version: '1.2.0',
        layers: [{
          type: 'cartodb',
          options: {
            sql: this.sql,
            cartocss: this.cartocss,
            cartocss_version: '2.3.0',
            geom_column: 'the_raster_webmercator',
            geom_type: 'raster',
            raster_band: 1
          }
        }]
      };

      var requestConfig = {
        resourceId: MAP_REQUEST_ID,
        data: JSON.stringify(layerConfig),
        success: resolve,
        error: reject
      };

      ds.request(requestConfig);

      }.bind(this));
    }

  });

  return CartoDbRasterLayerService;

});
