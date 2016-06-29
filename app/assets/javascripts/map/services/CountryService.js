/**
 * CountryService provides access to information about countries.
 */
define([
  'Class',
  'uri',
  'map/services/DataService'
], function (Class, UriTemplate, ds) {

  'use strict';

  var GET_REQUEST_ID = 'CountryService:get',
      SHOW_REQUEST_ID = 'CountryService:show';

  var URL = window.gfw.config.GFW_API_HOST + '/countries/{iso}';


  var CountryService = Class.extend({

    get: function() {
      return new Promise(function(resolve, reject) {

        var url = new UriTemplate(URL).fillFromObject({});

        ds.define(GET_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: url,
          type: 'GET'
        });

        var requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: resolve
        };

        ds.request(requestConfig);

      });
    },

    show: function(id) {
      return new Promise(function(resolve, reject) {

        var url = new UriTemplate(URL).fillFromObject({id: id});

        ds.define(SHOW_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: url,
          type: 'GET'
        });

        var requestConfig = {
          resourceId: SHOW_REQUEST_ID,
          success: resolve,
          error: reject
        };

        ds.request(requestConfig);

      });
    }

  });

  var service = new CountryService();

  return service;
});
