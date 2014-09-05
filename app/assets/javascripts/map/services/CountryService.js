/**
 * CountryService provides access to information about countries.
 */
define([
  'Class',
  'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var CountryService = Class.extend({

    requestId: 'CountryService',

    _uriTemplate:'http://beta.gfw-apis.appspot.com/countries/{iso}',

    /**
     * Constructs a new instance of CountryService.
     *
     * @return {CountryService} instance
     */
    init: function() {
      this._defineRequests();
    },

    /**
     * The configuration for client side caching of results.
     */
    _cacheConfig: {type: 'persist', duration: 1, unit: 'days'},

    /**
     * Defines requests used by CountryService.
     */
    _defineRequests: function() {
      var cache = this._cacheConfig;
      var config = {cache: cache, url: this._uriTemplate};

      ds.define(this.requestId, config);
    },

    execute: function(iso, successCb, failureCb) {
      var config = {resourceId: this.requestId, data: {iso: iso},
        success: successCb, error: failureCb};

      ds.request(config);
    }
  });

  var service = new CountryService();

  return service;
});
