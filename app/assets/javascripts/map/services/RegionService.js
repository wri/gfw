/**
 * RegionService provides access to information about countries.
 */
define([
  'Class',
  'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var GET_REQUEST_ID = 'RegionService:get',
      SHOW_REQUEST_ID = 'RegionService:show';


  var URL = 'http://wri-01.cartodb.com/api/v1/sql?q={sql}&format={format}';

  var SQLGET = 'SELECT id_1, name_1 FROM gadm2_provinces_simple where iso=\'{country}\' ORDER BY name_1';
  var SQLSHOW = 'SELECT * FROM gadm2_provinces_simple where iso=\'{country}\' and id_1=\'{region}\' ORDER BY name_1';


  var RegionService = Class.extend({

    get: function(country) {
      return new Promise(function(resolve, reject) {

        var sql = new UriTemplate(SQLGET).fillFromObject({
          country: country
        });

        var url = new UriTemplate(URL).fillFromObject({
          sql: sql
        });

        ds.define(GET_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: url,
          type: 'GET',

          // TO-DO We should move this to the DataService
          decoder: function ( data, status, xhr, success, error ) {
            if ( status === "success" ) {
              success( data, xhr );
            } else if ( status === "fail" || status === "error" ) {
              error( JSON.parse(xhr.responseText) );
            } else if ( status === "abort") {
              
            } else {
              error( JSON.parse(xhr.responseText) );
            }
          }          
        });

        var requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: resolve
        };

        ds.request(requestConfig);

      });
    },

    show: function(country,region) {
      return new Promise(function(resolve, reject) {

        var sql = new UriTemplate(SQLSHOW).fillFromObject({
          country: country,
          region: region
        });

        var url = new UriTemplate(URL).fillFromObject({
          sql: sql,
          format: 'geojson'
        });

        ds.define(SHOW_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: url,
          type: 'GET',
          // TO-DO We should move this to the DataService
          decoder: function ( data, status, xhr, success, error ) {
            if ( status === "success" ) {
              success( data, xhr );
            } else if ( status === "fail" || status === "error" ) {
              error( JSON.parse(xhr.responseText) );
            } else if ( status === "abort") {
              
            } else {
              error( JSON.parse(xhr.responseText) );
            }
          }          

        });

        var requestConfig = {
          resourceId: SHOW_REQUEST_ID,
          success: function(data, status) {
            resolve(data,status);        
          },
          error: function(errors) {
            reject(errors);
          }
        };

        ds.request(requestConfig);

      }.bind(this));
    },

  });

  var service = new RegionService();

  return service;
});