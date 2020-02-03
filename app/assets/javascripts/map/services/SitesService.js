/**
 * Sites Service provides access to information about sites for Protected Areas.
 */
define([
  'Class',
  'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var SitesServices = Class.extend({

    requestId: 'SitesService',

    _uriTemplate: window.gfw.config.GFW_API_OLD + '/wdpa/sites',

    /**
     * Constructs a new instance of SitesService.
     *
     * @return {SitesService} instance
     */
    init: function() {
      this._defineRequests();
    },

    /**
     * The configuration for client side caching of results.
     */
    _cacheConfig: {type: 'persist', duration: 1, unit: 'days'},

    /**
     * Defines requests used by SitesService.
     */
    _defineRequests: function() {
      var cache = this._cacheConfig;
      var config = {cache: cache, url: this._uriTemplate};
      ds.define(this.requestId, config);
    },

    execute: function(params, successCb, failureCb) {
      var config = {resourceId: this.requestId, data: params,
        success: successCb, error: failureCb};

      ds.request(config);
    }
  });

  var service = new SitesServices();

  return service;
});
