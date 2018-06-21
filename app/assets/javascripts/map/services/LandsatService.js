define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_LANDSAT_TILES_ID = 'LandsatService:getTiles';
  var GET_REQUEST_REFRESH_TILES_ID = 'LandsatService:getRefreshTiles';

  var APIURL = window.gfw.config.GFW_API;

  var APIURLS = {
    'getTiles': '/landsat-tiles/{year}'
  };

  var LandsatService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getTiles: function(year) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getTiles).fillFromObject({
          year: year
        });

        var requestId = GET_REQUEST_LANDSAT_TILES_ID + '_' + year;
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

    getRefreshTiles: function (year, url) {
      var requestId = GET_REQUEST_REFRESH_TILES_ID + '_' + year;

      this.defineRequest(
        requestId,
        url.replace('{z}/{x}/{y}', '12/1/1'),
        { type: 'persist', duration: 1, unit: 'days' }
      );

      var requestConfig = {resourceId: requestId};

      this.abortRequest(requestId);
      this.currentRequest[requestId] = ds.request(requestConfig);
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

  return new LandsatService();

});
