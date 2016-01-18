define([
  'Class', 'uri', 'bluebird',
  'map/services/DataService'
], function (Class, UriTemplate, Promise, ds) {

  'use strict';

  var MAP_REQUEST_ID = 'CartoDbLayerService:fetchRasterLayerMap',
      SQL_REQUEST_ID = 'CartoDbLayerService:fetchRasterLayerDates';

  var SQL_URL = 'https://wri-01.cartodb.com/api/v2/sql{?q}',
      MAP_URL = 'http://wri-01.cartodb.com/api/v1/map?stat_tag=API';

  var CartoDbRasterLayerService = Class.extend({

    init: function(options) {
      this.sql = options.sql;
      this.cartocss = options.cartocss;
      this.dateAttribute = options.dateAttribute;
      this.table = options.table;

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

      var sql = 'SELECT MIN('+this.dateAttribute+') AS min_date, MAX('+this.dateAttribute+') AS max_date FROM '+this.table,
          url = new UriTemplate(SQL_URL).fillFromObject({q: sql});
      ds.define(SQL_REQUEST_ID, {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: url,
        type: 'GET'
      });
    },

    fetchLayerConfig: function() {
      return Promise.all([
         this.fetchLayerDates(),
         this.fetchLayerMap()
      ]);
    },

    fetchLayerMap: function() {
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
    },

    fetchLayerDates: function() {
      return new Promise(function(resolve, reject) {

      var requestConfig = {
        resourceId: SQL_REQUEST_ID,
        success: resolve,
        error: reject
      };

      ds.request(requestConfig);

      });
    }

  });

  return CartoDbRasterLayerService;

});
