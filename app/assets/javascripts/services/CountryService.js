define([
  'Class',
  'uri',
  'bluebird',
  'services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var CONFIG = {
    countriesConfigDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
    countriesConfigTable: 'gfw_countries_config',
    countriesDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
    countriesTable: 'gadm28_countries',
    regionsDataset: '098b33df-6871-4e53-a5ff-b56a7d989f9a',
    regionsTable: 'gadm28_adm1',
    subRegionsDataset: 'b3d076cc-b150-4ccb-a93e-eca05d9ac2bf',
    subRegionsTable: 'gadm28_adm2'
  };

  var GET_REQUEST_COUNTRY_CONFIG_ID = 'CountryService:getCountries',
      GET_REQUEST_COUNTRIES_LIST_ID = 'CountryService:getCountries',
      SHOW_REQUEST_COUNTRY_ID = 'CountryService:showCountry',
      GET_REQUEST_COUNTRY_INFO_ID = 'CountryService:getCountryInfo',
      GET_REQUEST_REGIONS_LIST_ID = 'CountryService:getRegionsList',
      SHOW_REQUEST_REGION_ID = 'CountryService:showRegion';

  var APIURL = window.gfw.config.GFW_API_HOST_PROD;

  var APIURLS = {
    'getCountryConfig'   : '/query/{countriesConfigDataset}?sql=SELECT iso, indepth FROM {countriesConfigTable} WHERE iso=\'{iso}\'',
    'getCountriesList'   : '/query/{countriesDataset}?sql=SELECT name_engli as name, iso FROM {countriesTable}',
    'showCountry'        : '/query/{countriesDataset}?sql=SELECT name_engli as name, iso, topojson, centroid FROM {countriesTable} WHERE iso=\'{iso}\'',
    'showCountryArea'    : '/query/{countriesDataset}?sql=SELECT name_engli as name, iso, area_ha FROM {countriesTable}',
    'getCountryInfo'     : '/query/{countriesDataset}?sql=SELECT {columns} FROM {countriesTable} {filter}',
    'getRegionsList'     : '/query/{regionsDataset}?sql=SELECT cartodb_id, iso, bbox as bounds, id_1, name_1 FROM {regionsTable} WHERE iso=\'{iso}\' ORDER BY name_1',
    'showRegion'         : '/query/{regionsDataset}?sql=SELECT id_1, name_1, geojson, centroid FROM {regionsTable} WHERE iso=\'{iso}\' AND id_1={region} ORDER BY name_1',
    'getSubRegionsList'  : '/query/{subRegionsDataset}?sql=SELECT id_1, name_1 FROM {subRegionsTable} WHERE iso=\'{iso}\' ORDER BY name_1'
  };

  var CountriesService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getCountryConfig: function(params) {
      var datasetId = GET_REQUEST_COUNTRY_CONFIG_ID + '_' + params.iso;
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.getCountryConfig).fillFromObject(status);

        this.defineRequest(datasetId,
          url, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: datasetId,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        ds.request(requestConfig);
      }.bind(this));
    },

    getCountries: function() {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getCountriesList).fillFromObject(CONFIG);

        this.defineRequest(GET_REQUEST_COUNTRIES_LIST_ID,
          url, { type: 'persist', duration: 1, unit: 'days' });

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
      var url = '';
      var datasetId = SHOW_REQUEST_COUNTRY_ID + '_' + params.iso;
      return new Promise(function(resolve, reject) {
        this.getCountryConfig(params)
          .then(function(countryConfig) {
            var status = _.extend({}, CONFIG, params);
            if (!params.showArea) {
              url = new UriTemplate(APIURLS.showCountry).fillFromObject(status);
            } else {
              url = new UriTemplate(params.showArea ? APIURLS.showCountryArea : APIURLS.showCountry).fillFromObject(status);
            }
            this.defineRequest(datasetId,
              url, { type: 'persist', duration: 1, unit: 'days' });

            var requestConfig = {
              resourceId: datasetId,
              success: function(res, status) {
                var dataCountryConfig = countryConfig.length >= 0 ? countryConfig[0] : [];
                var dataCountry = res.data.length >= 0 ? res.data[0] : [];
                if(!params.showArea) {
                  var data = _.extend({}, dataCountry, dataCountryConfig);
                } else {
                  var data = params.showArea ? res : _.extend({}, dataCountry, dataCountryConfig);
                }
                resolve(data, status);
              },
              error: function(errors) {
                reject(errors);
              }
            };

            ds.request(requestConfig);
          }.bind(this))
          .error(function(error) {
            console.warn(error);
          }.bind(this))
      }.bind(this));
    },

    getRegionsList: function(params) {
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.getRegionsList).fillFromObject(status);

        this.defineRequest(GET_REQUEST_REGIONS_LIST_ID,
          url, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: GET_REQUEST_REGIONS_LIST_ID,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        if (!this.currentRequest[GET_REQUEST_REGIONS_LIST_ID]) {
          this.currentRequest[GET_REQUEST_REGIONS_LIST_ID] = ds.request(requestConfig);
        }
      }.bind(this));
    },

    showRegion: function(params) {
      var datasetId = SHOW_REQUEST_REGION_ID + '_' + params.iso + '_' + params.region;
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.showRegion).fillFromObject(status);
        this.defineRequest(datasetId,
          url, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: datasetId,
          success: function(res, status) {
            var data = res.data.length >= 0 ? res.data[0] : [];
            resolve(data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        ds.request(requestConfig);
      }.bind(this));
    },

    getCountriesInfo: function(params) {
      var datasetId = GET_REQUEST_COUNTRY_INFO_ID;
      return new Promise(function(resolve, reject) {
        var status = _.extend({}, CONFIG, params);
        var url = new UriTemplate(APIURLS.getCountryInfo).fillFromObject(status);

        this.defineRequest(datasetId, url, false);

        var requestConfig = {
          resourceId: datasetId,
          success: function(res, status) {
            var data = res.data.length >= 0 ? res.data : [];
            resolve(data, status);
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
        url: APIURL + url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        decoder: function ( data, status, xhr, success, error ) {
          if ( status === "success" ) {
            success( data, xhr );
          } else if ( status === "fail" || status === "error" ) {
            error(xhr.statusText);
          } else if ( status === "abort") {

          } else {
            error(xhr.statusText);
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

  return new CountriesService();

});
