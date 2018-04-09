define([
  'Class', 'bluebird',
  'map/services/DataService'
], function (Class, Promise, ds) {

  'use strict';

  var REQUEST_ID = 'CartoDbNamedMapService:fetchLayerMap';
  var URL = 'https://wri-01.carto.com/api/v1/map/named/';

  var CartoDbNamedMapService = Class.extend({

    init: function(options) {
      this.namedMap = options.namedMap;
      this.table = options.table;

      this._defineRequests();
    },

    _defineRequests: function() {
      ds.define(REQUEST_ID, {
        cache: {type: 'persist', duration: 1, unit: 'days'},
        url: URL + this.namedMap,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      });
    },

    fetchLayerConfig: function() {
      return new Promise(function(resolve, reject) {

      var layerConfig = {
        table: this.table
      };

      var requestConfig = {
        resourceId: REQUEST_ID,
        data: JSON.stringify(layerConfig),
        success: resolve,
        error: reject
      };

      ds.request(requestConfig);

      }.bind(this));
    }

  });

  return CartoDbNamedMapService;

});
