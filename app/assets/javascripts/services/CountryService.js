/* eslint-disable */
define(['Class', 'uri', 'bluebird', 'map/services/DataService'], function(
  Class,
  UriTemplate,
  Promise,
  ds
) {
  'use strict';

  var CONFIG = {
    countriesConfigDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
    countriesConfigTable: 'gfw_countries_config',
    countriesDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
    countriesTable: 'gadm36_countries',
    regionsDataset: '098b33df-6871-4e53-a5ff-b56a7d989f9a',
    regionsTable: 'gadm36_adm1',
    subRegionsDataset: 'b3d076cc-b150-4ccb-a93e-eca05d9ac2bf',
    subRegionsTable: 'gadm36_adm2'
  };

  var GET_REQUEST_COUNTRY_CONFIG_ID = 'CountryService:getCountries',
    GET_REQUEST_COUNTRIES_LIST_ID = 'CountryService:getCountries',
    SHOW_REQUEST_COUNTRY_ID = 'CountryService:showCountry',
    GET_REQUEST_REGIONS_LIST_ID = 'CountryService:getRegionsList',
    SHOW_REQUEST_REGION_ID = 'CountryService:showRegion',
    GET_REQUEST_SUBREGIONS_LIST_ID = 'CountryService:getSubRegionsList',
    SHOW_REQUEST_SUBREGION_ID = 'CountryService:showSubRegion';

  var APIURL = window.gfw.config.GFW_API;
  var CARTO_API = window.gfw.config.CARTO_API;

  var APIURLS = {
    getCountryConfig:
      "/query/{countriesConfigDataset}?sql=SELECT iso, indepth FROM {countriesConfigTable} WHERE iso='{iso}' AND iso != 'XCA' AND iso != 'TWN'",
    getCountriesList:
      "/query/{countriesDataset}?sql=SELECT name_engli as name, iso FROM {countriesTable} WHERE iso != 'XCA' AND iso != 'TWN' ORDER BY name",
    showCountry:
      "/query/{countriesDataset}?sql=SELECT name_engli as name, iso, ST_AsGeoJSON(the_geom) AS geojson FROM {countriesTable} WHERE iso='{iso}'",
    getRegionsList:
      "/query/{regionsDataset}?sql=SELECT cartodb_id, iso, bbox as bounds, gid_1 as id_1, name_1 FROM {regionsTable} WHERE iso='{iso}' AND iso != 'XCA' AND iso != 'TWN' ORDER BY name_1",
    showRegion:
      "/query/{regionsDataset}?sql=SELECT gid_1 as id_1, name_1, ST_AsGeoJSON(the_geom) AS geojson FROM {regionsTable} WHERE iso='{iso}' AND gid_1='{region}' ORDER BY name_1",
    getSubRegionsList:
      "/sql?q=SELECT gid_2 as id, name_2 as name FROM gadm36_adm2 WHERE iso = '{iso}' AND iso != 'XCA' AND iso != 'TWN' AND gid_1 = '{region}' ORDER BY name",
    showSubRegion:
      "/sql?q=SELECT gid_2 as id, name_2 as name, ST_AsGeoJSON(the_geom) AS geojson FROM gadm36_adm2 WHERE iso = '{iso}' AND iso != 'XCA' AND iso != 'TWN' AND gid_1 = '{region}' AND gid_2 = '{subRegion}' ORDER BY name"
  };

  var parseGadm36Id = function(gid) {
    const ids = gid.split('.');
    const adm0 = ids[0] || null;
    const adm1 = ids[1] && ids[1].split('_')[0];
    const adm2 = ids[2] && ids[2].split('_')[0];
    return { adm0, adm1: parseInt(adm1, 10), adm2: parseInt(adm2, 10) };
  };

  var buildGadm36Id = (country, region, subRegion) =>
    `${country}${region ? `.${region}` : ''}${
      subRegion ? `.${subRegion}_1` : '_1'
    }`;

  var CountriesService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getCountryConfig: function(params) {
      var datasetId = GET_REQUEST_COUNTRY_CONFIG_ID + '_' + params.iso;
      return new Promise(
        function(resolve, reject) {
          var status = _.extend({}, CONFIG, params);
          var url = new UriTemplate(
            APIURL + APIURLS.getCountryConfig
          ).fillFromObject(status);

          this.defineRequest(datasetId, url);

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
        }.bind(this)
      );
    },

    getCountries: function() {
      return new Promise(
        function(resolve, reject) {
          var url = new UriTemplate(
            APIURL + APIURLS.getCountriesList
          ).fillFromObject(CONFIG);

          this.defineRequest(GET_REQUEST_COUNTRIES_LIST_ID, url);

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
          this.currentRequest[GET_REQUEST_COUNTRIES_LIST_ID] = ds.request(
            requestConfig
          );
        }.bind(this)
      );
    },

    showCountry: function(params) {
      var datasetId = SHOW_REQUEST_COUNTRY_ID + '_' + params.iso;
      return new Promise(
        function(resolve, reject) {
          this.getCountryConfig(params)
            .then(
              function(countryConfig) {
                var status = _.extend({}, CONFIG, params);
                var url = new UriTemplate(
                  APIURL + APIURLS.showCountry
                ).fillFromObject(status);
                this.defineRequest(datasetId, url);
                var requestConfig = {
                  resourceId: datasetId,
                  success: function(res, status) {
                    var dataCountryConfig =
                      countryConfig.length >= 0 ? countryConfig[0] : [];
                    var dataCountry = res.data.length >= 0 ? res.data[0] : [];
                    var data = _.extend({}, dataCountry, dataCountryConfig);
                    resolve(data, status);
                  },
                  error: function(errors) {
                    reject(errors);
                  }
                };

                ds.request(requestConfig);
              }.bind(this)
            )
            .error(
              function(error) {
                console.warn(error);
              }.bind(this)
            );
        }.bind(this)
      );
    },

    getRegionsList: function(params) {
      return new Promise(
        function(resolve, reject) {
          var status = _.extend({}, CONFIG, params);
          var url = new UriTemplate(
            APIURL + APIURLS.getRegionsList
          ).fillFromObject(status);

          this.defineRequest(GET_REQUEST_REGIONS_LIST_ID, url);

          var requestConfig = {
            resourceId: GET_REQUEST_REGIONS_LIST_ID,
            success: function(res, status) {
              var data = res.data.map(d => {
                var ids = parseGadm36Id(d.id_1);
                return {
                  iso: d.iso,
                  bounds: d.bounds,
                  name_1: d.name_1,
                  id_1: ids.adm1
                };
              });
              resolve(data, status);
            },
            error: function(errors) {
              reject(errors);
            }
          };

          this.abortRequest(GET_REQUEST_REGIONS_LIST_ID);
          this.currentRequest[GET_REQUEST_REGIONS_LIST_ID] = ds.request(
            requestConfig
          );
        }.bind(this)
      );
    },

    showRegion: function(params) {
      var datasetId =
        SHOW_REQUEST_REGION_ID + '_' + params.iso + '_' + params.region;
      return new Promise(
        function(resolve, reject) {
          var status = _.extend({}, CONFIG, params, {
            region: buildGadm36Id(params.iso, params.region)
          });
          var url = new UriTemplate(APIURL + APIURLS.showRegion).fillFromObject(
            status
          );

          this.defineRequest(datasetId, url);

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
        }.bind(this)
      );
    },

    getSubRegionsList: function(params) {
      return new Promise(
        function(resolve, reject) {
          var status = _.extend({}, CONFIG, params, {
            region: buildGadm36Id(params.iso, params.region)
          });
          var url = new UriTemplate(
            CARTO_API + APIURLS.getSubRegionsList
          ).fillFromObject(status);
          this.defineRequest(GET_REQUEST_SUBREGIONS_LIST_ID, url);

          var requestConfig = {
            resourceId: GET_REQUEST_SUBREGIONS_LIST_ID,
            success: function(res, status) {
              var data = res.rows.map(d => {
                var ids = parseGadm36Id(d.id);
                return {
                  name: d.name,
                  id: ids.adm2
                };
              });
              resolve(data, status);
            },
            error: function(errors) {
              reject(errors);
            }
          };

          this.abortRequest(GET_REQUEST_SUBREGIONS_LIST_ID);
          this.currentRequest[GET_REQUEST_SUBREGIONS_LIST_ID] = ds.request(
            requestConfig
          );
        }.bind(this)
      );
    },

    showSubRegion: function(params) {
      var datasetId =
        SHOW_REQUEST_SUBREGION_ID +
        '_' +
        params.iso +
        '_' +
        params.region +
        '_' +
        params.subRegion;
      return new Promise(
        function(resolve, reject) {
          var status = _.extend({}, CONFIG, params, {
            region: buildGadm36Id(params.iso, params.region),
            subRegion: buildGadm36Id(
              params.iso,
              params.region,
              params.subRegion
            )
          });
          var url = new UriTemplate(
            CARTO_API + APIURLS.showSubRegion
          ).fillFromObject(status);

          this.defineRequest(datasetId, url);

          var requestConfig = {
            resourceId: datasetId,
            success: function(res, status) {
              var data = res.rows.length >= 0 ? res.rows[0] : [];
              resolve(data, status);
            },
            error: function(errors) {
              reject(errors);
            }
          };

          ds.request(requestConfig);
        }.bind(this)
      );
    },

    defineRequest: function(id, url, cache) {
      ds.define(id, {
        cache: cache,
        url: url,
        type: 'GET',
        dataType: 'json',
        decoder: function(data, status, xhr, success, error) {
          if (status === 'success') {
            success(data, xhr);
          } else if (status === 'fail' || status === 'error') {
            error(xhr.statusText);
          } else if (status === 'abort') {
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
