define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_SENTINEL_TILES_ID = 'SentinelService:getTiles';

  var APIURL = 'https://staging-api.globalforestwatch.org/v1';

  var APIURLS = {
    'getTiles': '/sentinel-tiles?lat={lat}&lon={lon}&start={start}&end={end}'
  };

  var SentinelService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getTiles: function(lat, lon, start, end) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getTiles).fillFromObject({
          lat: lat,
          lon: lon,
          start: start,
          end: end
        });

        var requestId = GET_REQUEST_SENTINEL_TILES_ID + '_' + lat + '_' + lon;
        this.defineRequest(
          requestId,
          APIURL + url,
          { type: 'persist', duration: 1, unit: 'days' }
        );

        var requestConfig = {
          resourceId: requestId,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(requestId);
        this.currentRequest[requestId] = ds.request(requestConfig);
      }.bind(this));
    },

    defineRequest: function (id, url, cache) {
      ds.define(id, {
        cache: cache,
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        decoder: function ( data, status, xhr, success, error ) {
          if ( status === "success" ) {
            success( data, xhr );
          }
        }
      });
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function(request) {
      if (this.currentRequest && this.currentRequest[request]) {
        this.currentRequest[request].abort();
        this.currentRequest[request] = null;
      }
    }

  });

  return new SentinelService();

});
