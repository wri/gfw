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
    'draw'    : '/{baselayer}{?geostore,period,thresh}',
    'country' : '/{baselayer}/admin{/country}{/region}{?period,thresh}',
    'wdpaid'  : '/{baselayer}/wdpa{/wdpaid}{?period,thresh}',
    'use'     : '/{baselayer}/use{/use}{/useid}{?period,thresh}',
  };

  var AnalysisService = Class.extend({

    get: function(status) {
      return new Promise(function(resolve, reject) {

        this.analysis = this.buildAnalysisFromStatus(status);
        console.log(this.analysis);

        var url = this.getUrl();

        ds.define(GET_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: APIURL + url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8'
        });

        var requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: resolve
        };

        this.abortRequest();
        this.currentRequest = ds.request(requestConfig);

      }.bind(this));
    },

    getUrl: function() {
      return new UriTemplate(APIURLS[this.analysis.type]).fillFromObject(this.analysis);
    },

    buildAnalysisFromStatus: function(status) {
      return _.extend({}, status, {
        country: status.iso.country,
        region: status.iso.region,
        thresh: status.threshold,
        period: status.begin + ',' + status.end
      })
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function() {
      this._currentRequest && this._currentRequest.abort();
      this._currentRequest = null;
    }

  });

  return new AnalysisService();

});
