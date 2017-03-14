define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_COUNTRIES_LIST_ID = 'CountryService:getCountries',
      SHOW_REQUEST_COUNTRY_ID = 'CountryService:showCountry',
      GET_REQUEST_REGIONS_LIST_ID = 'CountryService:getRegionsList',
      SHOW_REQUEST_REGION_ID = 'CountryService:showRegion';

  var APIURL = window.gfw.config.GFW_API_HOST_PROD;

  var CONFIG = {
    countriesDataset  : window.gfw.config.GFW_COUNTRIES_DATASET,
    countriesTable    : window.gfw.config.GFW_COUNTRIES_TABLE,
    regionsDataset    : window.gfw.config.GFW_REGIONS_DATASET,
    regionsTable      : window.gfw.config.GFW_REGIONS_TABLE,
    subRegionsDataset : window.gfw.config.GFW_SUB_REGIONS_DATASET,
    subRegionsTable   : window.gfw.config.GFW_SUB_REGIONS_TABLE
  };

  var APIURLS = {
    'getCountriesList'  : '/query/{countriesDataset}?sql=SELECT name_engli as name, iso FROM {countriesTable}',
    'showCountry'       : '/query/{countriesDataset}?sql=SELECT name_engli as name, iso, topojson FROM {countriesTable} WHERE iso=\'{iso}\'',
    'getRegionsList'    : '/query/{regionsDataset}?sql=SELECT id_1, name_1 FROM {regionsTable} WHERE iso=\'{iso}\' ORDER BY name_1',
    'showRegion'        : '/query/{regionsDataset}?sql=SELECT id_1, name_1 FROM {regionsTable} WHERE iso=\'{iso}\' AND id_1={region} ORDER BY name_1',
    'getSubRegionsList' : '/query/{subRegionsDataset}?sql=SELECT id_1, name_1 FROM {subRegionsTable} WHERE iso=\'{iso}\' ORDER BY name_1'
  };

  var CountriesService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getCountries: function() {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getCountriesList).fillFromObject(CONFIG);

        ds.define(GET_REQUEST_COUNTRIES_LIST_ID, {
          cache: { type: 'persist', duration: 1, unit: 'days' },
          url: APIURL + url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
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
          resourceId: GET_REQUEST_COUNTRIES_LIST_ID,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(GET_REQUEST_COUNTRIES_LIST_ID);
        this.currentRequest[GET_REQUEST_COUNTRIES_LIST_ID] = ds.request(requestConfig);
      }.bind(this));
    },

    showCountry: function(params) {
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.showCountry).fillFromObject(status);

        ds.define(SHOW_REQUEST_COUNTRY_ID, {
          cache: { type: 'persist', duration: 1, unit: 'days' },
          url: APIURL + url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
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
          resourceId: SHOW_REQUEST_COUNTRY_ID,
          success: function(res, status) {
            var data = res.data.length >= 0 ? res.data[0] : [];
            resolve(data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(SHOW_REQUEST_COUNTRY_ID);
        this.currentRequest[SHOW_REQUEST_COUNTRY_ID] = ds.request(requestConfig);
      }.bind(this));
    },

    getRegionsList: function(params) {
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.getRegionsList).fillFromObject(status);

        ds.define(GET_REQUEST_REGIONS_LIST_ID, {
          cache: { type: 'persist', duration: 1, unit: 'days' },
          url: APIURL + url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
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
          resourceId: GET_REQUEST_REGIONS_LIST_ID,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(GET_REQUEST_REGIONS_LIST_ID);
        this.currentRequest[GET_REQUEST_REGIONS_LIST_ID] = ds.request(requestConfig);
      }.bind(this));
    },

    showRegion: function(params) {
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.showRegion).fillFromObject(status);

        ds.define(SHOW_REQUEST_REGION_ID, {
          cache: { type: 'persist', duration: 1, unit: 'days' },
          url: APIURL + url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
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
          resourceId: SHOW_REQUEST_REGION_ID,
          success: function(res, status) {
            var data = res.data.length >= 0 ? res.data[0] : [];
            resolve(data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(SHOW_REQUEST_REGION_ID);
        this.currentRequest[SHOW_REQUEST_REGION_ID] = ds.request(requestConfig);
      }.bind(this));
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

  return new CountriesService();

});
