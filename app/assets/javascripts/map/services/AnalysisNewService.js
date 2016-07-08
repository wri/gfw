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

  var USENAMES = ['mining', 'oilpalm', 'fiber', 'logging'];

  var AnalysisService = Class.extend({

    get: function(status) {
        
      return new Promise(function(resolve, reject) {
        console.log(status);
        this.analysis = this.buildAnalysisFromStatus(status);
        console.log(this.analysis);
        var url = this.getUrl();
        console.log(url);

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

    getUse: function(use) {
      var USENAME = _.filter(USENAMES, function(name){
        return (use.indexOf(name) != -1)
      });
      
      return (USENAME.length) ? USENAME[0] : use;
    },

    buildAnalysisFromStatus: function(status) {
      return _.extend({}, status, {
        country: status.iso.country,
        region: status.iso.region,
        thresh: status.threshold,
        period: status.begin + ',' + status.end,
        use: (!!status.use) ? this.getUse(status.use) : null
      });
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
