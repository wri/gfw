define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_ID = 'CoverageService:get';

  var APIURL = window.gfw.config.GFW_API;

  var APIURLS = {
    'country'      : '/coverage/intersect/admin/{country}',
    'region'       : '/coverage/intersect/admin/{country}/{region}',
    'wdpaid'       : '/coverage/intersect/wdpa/{wdpaid}',
    'use'          : '/coverage/intersect/use/{use}/{useid}',
    'use-geostore' : '/coverage/intersect?geostore={geostore}',
  };

  var CoverageService = Class.extend({

    get: function(params) {
      return new Promise(function(resolve, reject) {
        this.coverage = this.buildEndpointFromParams(params);

        if (this.coverage.type) {
          var url = this.getUrl();

          ds.define(GET_REQUEST_ID, {
            cache: false,
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
              resolve(data.data.attributes.layers, status);
            },
            error: function(errors) {
              reject(errors);
            }
          };

          this.abortRequest();
          this.currentRequest = ds.request(requestConfig);
        } else {
          resolve();
        }
      }.bind(this));
    },

    getUrl: function() {
      return new UriTemplate(APIURLS[this.coverage.type]).fillFromObject(this.coverage);
    },

    buildEndpointFromParams: function(params) {
      var status = _.extend({}, params);

      if (status.country && !status.region) {
        status.type = 'country';
      }

      if (status.country && status.region) {
        status.type = 'region';
      }

      if (status.wdpaid) {
        status.type = 'wdpaid';
      }

      if (status.use) {
        status.type = 'use';
      }

      if (status.geostore) {
        status.type = 'use-geostore';
      }

      return status;
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
