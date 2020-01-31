/**
 * CountryService provides access to information about countries.
 */
/* eslint-disable */
define(['Class', 'uri', 'bluebird', 'map/services/DataService'], function(
  Class,
  UriTemplate,
  Promise,
  ds
) {
  'use strict';

  var GET_REQUEST_ID = 'CountryService:get',
    SHOW_REQUEST_ID = 'CountryService:show';

  var URL = window.gfw.config.GFW_API_OLD + '/countries/{id}';

  var CountryService = Class.extend({
    get: function() {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(URL).fillFromObject({});

        ds.define(GET_REQUEST_ID, {
          cache: { type: 'persist', duration: 1, unit: 'days' },
          // cache: false,
          url: url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',

          decoder: function(data, status, xhr, success, error) {
            if (status === 'success') {
              data.countries = _.filter(data.countries, function(country) {
                return country.iso !== null && country.enabled == true;
              });
              success(data, xhr);
            } else if (status === 'fail' || status === 'error') {
              error(JSON.parse(xhr.responseText));
            } else if (status === 'abort') {
            } else {
              error(JSON.parse(xhr.responseText));
            }
          }
        });

        var requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: function(data, status) {
            resolve(data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        ds.request(requestConfig);
      });
    },

    show: function(id) {
      return new Promise(
        function(resolve, reject) {
          var url = new UriTemplate(URL).fillFromObject({ id: id });
          ds.define(SHOW_REQUEST_ID, {
            cache: { type: 'persist', duration: 1, unit: 'days' },
            url: url,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',

            // TO-DO We should move this to the DataService
            decoder: function(data, status, xhr, success, error) {
              if (status === 'success') {
                success(data, xhr);
              } else if (status === 'fail' || status === 'error') {
                error(JSON.parse(xhr.responseText));
              } else if (status === 'abort') {
              } else {
                error(JSON.parse(xhr.responseText));
              }
            }
          });

          var requestConfig = {
            resourceId: SHOW_REQUEST_ID,
            success: function(data, status) {
              resolve(data, status);
            },
            error: function(errors) {
              reject(errors);
            }
          };

          ds.request(requestConfig);
        }.bind(this)
      );
    }
  });

  var service = new CountryService();

  return service;
});
