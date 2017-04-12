define([
  'Class',
  'uri',
  'bluebird',
  'helpers/geojsonUtilsHelper',
  'map/services/GeostoreService',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, geojsonUtilsHelper, GeostoreService, ds) {

  'use strict';

  var GET_REQUEST_ID = 'AnalysisService:get';

  var APIURL = window.gfw.config.GFW_API_HOST_NEW_API;

  var FORMA_URL = 'http://api.forma-250.appspot.com/analysis/gfw?s={startDate}&e={endDate}&g={geojson}';
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
        this.getUrl().then(function(data) {
          var url = data.isForma ? data.url : APIURL + data.url;
          var requestID = data.isForma ? GET_REQUEST_ID + '_FORMA' : GET_REQUEST_ID;

          ds.define(requestID, {
            cache: false,
            url: url,
            type: 'GET',
            dataType: 'json',
            decoder: function ( data, status, xhr, success, error ) {
              if ( status === "success" ) {
                success( data, xhr );
              } else if ( status === "fail" || status === "error" ) {
                error(xhr.responseText);
              } else if ( status !== "abort") {
                error(xhr.responseText);
              }
            }
          });

          var requestConfig = {
            resourceId: requestID,
            success: function(response, status) {
              if (data.isForma) {
                var areaHa = this.formaGeometry
                  ? geojsonUtilsHelper.getHectares(this.formaGeometry)
                  : 0;
                var parsedResponse = {
                  data: {
                    type: 'forma_month_3',
                    id: '',
                    attributes: {
                      areaHa: parseInt(areaHa.replace(/(,)/g,'')),
                      value: response.forma.delta.count
                    }
                  }
                }
                resolve(parsedResponse, status);
              } else {
                resolve(response, status);
              }
            }.bind(this),
            error: function(errors) {
              reject(errors);
            }.bind(this)
          };

          this.abortRequest();
          this.currentRequest = ds.request(requestConfig);
        }.bind(this));

      }.bind(this));
    },

    getUrl: function() {
      return new Promise(function(resolve, reject) {
        // TESTING, move to microservice when stable
        if (this.analysis.dataset === 'forma_month_3') {
          GeostoreService.get(this.analysis.geostore)
            .then(function(response) {
              if (response && response.data.attributes.geojson) {
                if (this.analysis.dataset === 'forma_month_3') {
                  var period = this.analysis.period.split(',');
                  var params ={
                    startDate: period[0],
                    endDate: period[1],
                  }
                  try {
                    this.formaGeometry = response.data.attributes.geojson.features[0].geometry;
                    params.geojson = JSON.stringify([_.flatten(response.data.attributes.geojson.features[0].geometry.coordinates, true)] || [])
                  } catch(e) {
                    params.geojson= [];
                  }
                  resolve({
                    url: UriTemplate(FORMA_URL).fillFromObject(params),
                    isForma: true
                  });
                } else {
                  reject();
                }
              }
            }.bind(this));
        } else {
          resolve({
            url: UriTemplate(APIURLS[this.analysis.type]).fillFromObject(this.analysis),
            isForma: false
          });
        }
      }.bind(this));
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
