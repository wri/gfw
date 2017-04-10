define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_TILE_URL_ID = 'FormaService:getTilesUrl';
  var GET_TILE_URL = 'http://api.forma-250.appspot.com/tiles/delta';

  var FormaService = Class.extend({
    getTileUrl: function() {
      return new Promise(function(resolve, reject) {
        this.defineRequest(GET_TILE_URL_ID, GET_TILE_URL, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: GET_TILE_URL_ID,
          success: function(res, status) {
            debugger;
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
        contentType: 'application/json; charset=utf-8',
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

  return new FormaService();

});
