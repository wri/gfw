/**
 * RegionService provides access to information about countries.
 */
define([
  'Class',
  'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var RegionService = Class.extend({

    requestId: 'RegionService',

    _uriTemplate:'http://wri-01.cartodb.com/api/v1/sql?q=SELECT%20*%20FROM%20gadm2_provinces_simple%20where%20iso=%27{iso}%27%20and%20id_1={id1}&format=geojson',

    /**
     * Constructs a new instance of RegionService.
     *
     * @return {RegionService} instance
     */
    init: function() {
      this._defineRequests();
    },

    /**
     * The configuration for client side caching of results.
     */
    _cacheConfig: {type: 'persist', duration: 1, unit: 'days'},

    /**
     * Defines requests used by RegionService.
     */
    _defineRequests: function() {
      var cache = this._cacheConfig;
      var config = {cache: cache, url: this._uriTemplate};

      ds.define(this.requestId, config);
    },

    execute: function(data, successCb, failureCb) {
      var config = {resourceId: this.requestId, data: data,
        success: successCb, error: failureCb};

      ds.request(config);
    }
  });

  var service = new RegionService();

  return service;
});
