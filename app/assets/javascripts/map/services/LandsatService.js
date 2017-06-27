define([
  'Class',
  'bluebird',
  'map/services/DataService'
], function(Class, Promise, ds) {

  'use strict';

  var GET_TILE_URL_ID = 'LandsatService:getTilesUrl';
  var GET_TILE_URL = 'https://staging-api.globalforestwatch.org/v1/landsat-tiles/';

  var LandsatService = Class.extend({
    getTileUrl: function(year) {
      return new Promise(function(resolve, reject) {
        this.defineRequest(GET_TILE_URL_ID, GET_TILE_URL + year, { type: 'persist', duration: 2, unit: 'days' });

        var requestConfig = {
          resourceId: GET_TILE_URL_ID,
          success: function(res, status) {
            resolve(res, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        ds.request(requestConfig);
      }.bind(this));
    },

    defineRequest: function (id, url, cache) {
      ds.define(id, {
        cache: cache,
        url: url,
        type: 'GET',
        dataType: 'json',
        decoder: function ( data, status, xhr, success, error ) {
          if ( status === "success" ) {
            success( data, xhr );
          } else if ( status === "fail" || status === "error" ) {
            error(xhr.statusText);
          } else if ( status !== "abort") {
            error(xhr.statusText);
          }
        }
      });
    }
  });

  return new LandsatService();

});
