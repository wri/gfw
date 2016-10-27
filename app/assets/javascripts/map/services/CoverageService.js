define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_ID = 'CoverageService:get';

  var APIURL = window.gfw.config.GFW_API_HOST_NEW_API;

  var APIURLS = {
    'country'      : '/coverage/intersect/admin/{country}',
    'region'       : '/coverage/intersect/admin/{country}/{region}',
    'wdpaid'       : '/coverage/intersect/wdpa/{wdpaid}>',
    'use'          : '/coverage/intersect/use/{use}/{useid}',
    'use-geostore' : '/coverage/intersect?geostore={geostore}',
  };

  var CoverageService = Class.extend({

    get: function(params) {
      return new Promise(function(resolve, reject) {
        this.coverage = this.buildEndpointFromParams(params);
        var url = this.getUrl();

        ds.define(GET_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
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
          resourceId: GET_REQUEST_ID,
          success: function(data, status) {
            resolve(data,status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest();
        this.currentRequest = ds.request(requestConfig);

      }.bind(this));
    },

    getUrl: function() {
      return new UriTemplate(APIURLS[this.coverage.type]).fillFromObject(this.coverage);
    },

    buildEndpointFromParams: function(params) {
      console.log(params);
      // // To allow layerOptions
      // // I really think that this should be an object instead of an array, or an array of objects
      // var layerOptions = {};
      // _.each(status.layerOptions, function(val) {
      //   layerOptions[val] = true;
      // });
      //
      // return _.extend({}, status, layerOptions, {
      //   country: status.iso.country,
      //   region: status.iso.region,
      //   thresh: status.threshold,
      //   period: status.begin + ',' + status.end,
      //
      //   // If a userGeostore exists we need to set geostore and type manually
      //   geostore: (status.useGeostore) ? status.useGeostore : status.geostore,
      //   type: (status.useGeostore) ? 'use-geostore' : status.type
      // }, layerOptions);
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function() {
      if (this.currentRequest) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
    }

  });

  return new CoverageService();

});
