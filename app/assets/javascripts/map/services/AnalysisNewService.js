define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_ID = 'AnalysisService:get';

  var APIURL = window.gfw.config.GFW_API_HOST_NEW_API;

  var APIURLS = {
    'draw'         : '/{dataset}{?geostore,period,thresh,gladConfirmOnly}',
    'country'      : '/{dataset}/admin{/country}{/region}{?period,thresh,gladConfirmOnly}',
    'wdpaid'       : '/{dataset}/wdpa{/wdpaid}{?period,thresh,gladConfirmOnly}',
    'use'          : '/{dataset}/use{/use}{/useid}{?period,thresh,gladConfirmOnly}',
    'use-geostore' : '/{dataset}{?geostore,period,thresh,gladConfirmOnly}',
  };

  var AnalysisService = Class.extend({

    get: function(status) {
      return new Promise(function(resolve, reject) {
        this.analysis = this.buildAnalysisFromStatus(status);
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
      return new UriTemplate(APIURLS[this.analysis.type]).fillFromObject(this.analysis);
    },

    buildAnalysisFromStatus: function(status) {
      // To allow layerOptions
      // I really think that this should be an object instead of an array, or an array of objects
      var layerOptions = {};
      _.each(status.layerOptions, function(val) {
        layerOptions[val] = true;
      });

      // TEMP
      var period = status.begin + ',' + status.end;
      if (status.dataset === "umd-loss-gain") {
        period = status.begin + ',' + moment.utc(status.end).subtract(1, 'days').format('YYYY-MM-DD');
      }

      return _.extend({}, status, layerOptions, {
        country: status.iso.country,
        region: status.iso.region,
        thresh: status.threshold,
        period: period,

        // If a userGeostore exists we need to set geostore and type manually
        geostore: (status.useGeostore) ? status.useGeostore : status.geostore,
        type: (status.useGeostore) ? 'use-geostore' : status.type
      }, layerOptions);
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

  return new AnalysisService();

});
