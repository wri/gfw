define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_TILE_URL_ID = 'FormaService:getTilesUrl';
  var GET_TILE_URL = 'https://api-dot-forma-250.appspot.com/tiles/latest';
  var GET_DATES_ID = 'FormaService:getDates';
  var GET_DATES_URL = 'https://api.forma-250.appspot.com/dates';

  var FormaService = Class.extend({
    getTileUrl: function() {
      return new Promise(function(resolve, reject) {
        this.defineRequest(GET_TILE_URL_ID, GET_TILE_URL, { type: 'persist', duration: 1, unit: 'days' });

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

    getDates: function() {
      return new Promise(function(resolve, reject) {
        this.defineRequest(GET_DATES_ID, GET_DATES_URL, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: GET_DATES_ID,
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
        cache: false,
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

  return new FormaService();

});
