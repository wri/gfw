/* eslint-disable */
define(['Class', 'uri', 'bluebird', 'map/services/DataService'], function(
  Class,
  UriTemplate,
  Promise,
  ds
) {
  'use strict';

  var GET_REQUEST_ID = 'GeostoreService:get',
    SAVE_REQUEST_ID = 'GeostoreService:save',
    GET_ISO_REQUEST_ID = 'GeostoreService:iso';

  var URL = window.gfw.config.GFW_API + '/geostore/{id}';
  var USE_URL = window.gfw.config.GFW_API + '/geostore/use/{use}/{useid}';
  var COUNTRY_URL = window.gfw.config.GFW_API + '/v2/geostore/admin/{country}';
  var REGION_URL =
    window.gfw.config.GFW_API + '/v2/geostore/admin/{country}/{region}';
  var SUBREGION_URL =
    window.gfw.config.GFW_API +
    '/v2/geostore/admin/{country}/{region}/{subRegion}';

  var GeostoreService = Class.extend({
    get: function(id) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(URL).fillFromObject({ id: id });

        ds.define(GET_REQUEST_ID, {
          cache: false,
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

    save: function(geojson) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(URL).fillFromObject({});
        ds.define(SAVE_REQUEST_ID, {
          cache: false,
          url: url,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        var requestConfig = {
          resourceId: SAVE_REQUEST_ID,
          data: JSON.stringify({
            geojson: geojson
          }),
          success: function(response) {
            resolve(response.data.id);
          },
          error: reject
        };

        ds.request(requestConfig);
      });
    },

    iso: function(iso) {
      return new Promise(function(resolve, reject) {
        var url = '';
        if (iso.country && iso.region && iso.subRegion) {
          url = new UriTemplate(SUBREGION_URL).fillFromObject({
            country: iso.country,
            region: iso.region,
            subRegion: iso.subRegion
          });
        } else if (iso.country && iso.region && !iso.subRegion) {
          url = new UriTemplate(REGION_URL).fillFromObject({
            country: iso.country,
            region: iso.region
          });
        } else if (iso.country && !iso.region && !iso.subRegion) {
          url = new UriTemplate(COUNTRY_URL).fillFromObject({
            country: iso.country
          });
        }

        ds.define(GET_ISO_REQUEST_ID, {
          cache: false,
          url: url,
          type: 'GET'
        });

        var requestConfig = {
          resourceId: GET_ISO_REQUEST_ID,
          success: function(response) {
            resolve(response.data.id);
          }
        };

        ds.request(requestConfig);
      });
    },

    use: function(provider) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(USE_URL).fillFromObject(provider);

        ds.define(SAVE_REQUEST_ID, {
          cache: false,
          url: url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        var requestConfig = {
          resourceId: SAVE_REQUEST_ID,
          success: function(response) {
            resolve(response.data.id);
          },
          error: reject
        };

        ds.request(requestConfig);
      });
    }
  });

  return new GeostoreService();
});
