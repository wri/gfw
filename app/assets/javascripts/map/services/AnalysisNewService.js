/* eslint-disable */
define(
  [
    'Class',
    'uri',
    'bluebird',
    'helpers/geojsonUtilsHelper',
    'map/services/GeostoreService',
    'map/services/DataService'
  ],
  function(
    Class,
    UriTemplate,
    Promise,
    geojsonUtilsHelper,
    GeostoreService,
    ds
  ) {
    'use strict';

    var GET_REQUEST_ID = 'AnalysisService:get';

    var APIURL = 'https://production-api.globalforestwatch.org';
    var APIURLV2 = 'https://production-api.globalforestwatch.org' + '/v3';

    var APIURLS = {
      draw: '/{dataset}{?geostore,period,thresh,gladConfirmOnly}',
      country:
        '/{dataset}/admin{/country}{/region}{/subRegion}{?period,thresh,gladConfirmOnly}',
      wdpaid: '/{dataset}/wdpa{/wdpaid}{?period,thresh,gladConfirmOnly}',
      use: '/{dataset}/use{/use}{/useid}{?period,thresh,gladConfirmOnly}',
      'use-geostore': '/{dataset}{?geostore,period,thresh,gladConfirmOnly}'
    };
    var AnalysisService = Class.extend({
      get: function(status) {
        if (
          (status.baselayers.indexOf('umd_as_it_happens') > -1 ||
            status.baselayers.indexOf('places_to_watch') > -1 ||
            status.baselayers.indexOf('terrailoss') > -1 ||
            status.baselayers.indexOf('forma_month_3') > -1 ||
            status.baselayers.indexOf('forma_activity') > -1 ||
            status.baselayers.indexOf('imazon') > -1 ||
            status.baselayers.indexOf('guyra') > -1 ||
            status.baselayers.indexOf('viirs_fires_alerts') > -1 ||
            status.baselayers.indexOf('umd_as_it_happens_per') > -1 ||
            status.baselayers.indexOf('umd_as_it_happens_cog') > -1 ||
            status.baselayers.indexOf('umd_as_it_happens_idn') > -1 ||
            status.baselayers.indexOf('prodes') > -1) &&
          status.type === 'draw'
        ) {
          var umdUrl = UriTemplate(APIURLS['draw']).fillFromObject({
            dataset: 'umd-loss-gain',
            geostore: status.geostore,
            period: status.period,
            thresh: status.threshold,
            gladConfirmOnly: status.gladConfirmOnly
          });
          return fetch(APIURL + umdUrl)
            .then(function(response) {
              return response.json();
            })
            .then(
              function(umdResponse) {
                return new Promise(
                  function(resolve, reject) {
                    this.analysis = this.buildAnalysisFromStatus(status);
                    this.apiHost = this.getApiHost(this.analysis.dataset);
                    this.getUrl().then(
                      function(data) {
                        ds.define(GET_REQUEST_ID, {
                          cache: false,
                          url: this.apiHost + data.url,
                          type: 'GET',
                          dataType: 'json',
                          decoder: function(data, status, xhr, success, error) {
                            if (status === 'success') {
                              success(data, xhr);
                            } else if (
                              status === 'fail' ||
                              status === 'error'
                            ) {
                              error(xhr.responseText);
                            } else if (status !== 'abort') {
                              error(xhr.responseText);
                            }
                          }
                        });
                        var requestConfig = {
                          resourceId: GET_REQUEST_ID,
                          success: function(response, status) {
                            var data = {
                              data: {
                                attributes: {
                                  areaHa: umdResponse.data.attributes.areaHa,
                                  gain: umdResponse.data.attributes.gain,
                                  loss: response.data.attributes.value,
                                  alerts: response.data.attributes.alertCounts,
                                  treeExtent:
                                    umdResponse.data.attributes.treeExtent,
                                  treeExtent2010:
                                    umdResponse.data.attributes.treeExtent2010,
                                  downloadUrls:
                                    response.data.attributes.downloadUrls
                                }
                              }
                            };
                            resolve(data, status);
                          }.bind(this),
                          error: function(errors) {
                            reject(errors);
                          }.bind(this)
                        };

                        this.abortRequest();
                        this.currentRequest = ds.request(requestConfig);
                      }.bind(this)
                    );
                  }.bind(this)
                );
              }.bind(this)
            );
        } else {
          return new Promise(
            function(resolve, reject) {
              this.analysis = this.buildAnalysisFromStatus(status);
              this.apiHost = this.getApiHost(this.analysis.dataset);
              this.getUrl().then(
                function(data) {
                  ds.define(GET_REQUEST_ID, {
                    cache: false,
                    url: this.apiHost + data.url,
                    type: 'GET',
                    dataType: 'json',
                    decoder: function(data, status, xhr, success, error) {
                      if (status === 'success') {
                        success(data, xhr);
                      } else if (status === 'fail' || status === 'error') {
                        error(xhr.responseText);
                      } else if (status !== 'abort') {
                        error(xhr.responseText);
                      }
                    }
                  });

                  var requestConfig = {
                    resourceId: GET_REQUEST_ID,
                    success: function(response, status) {
                      var data = {};
                      if (this.analysis.type === 'country') {
                        data = {
                          data: {
                            attributes: {
                              areaHa: response.data.attributes.totals.areaHa,
                              gain: response.data.attributes.totals.gain,
                              loss: response.data.attributes.totals.loss,
                              alerts:
                                response.data.attributes.totals.gladAlerts,
                              treeExtent:
                                response.data.attributes.totals.extent2000,
                              treeExtent2010:
                                response.data.attributes.totals.extent2010
                            }
                          }
                        };
                      } else {
                        data = {
                          data: {
                            attributes: {
                              areaHa: response.data.attributes.areaHa,
                              gain: response.data.attributes.gain,
                              loss: response.data.attributes.loss,
                              alerts: response.data.attributes.value,
                              treeExtent: response.data.attributes.treeExtent,
                              treeExtent2010:
                                response.data.attributes.treeExtent2010,
                              downloadUrls:
                                response.data.attributes.downloadUrls
                            }
                          }
                        };
                      }
                      resolve(data, status);
                    }.bind(this),
                    error: function(errors) {
                      reject(errors);
                    }.bind(this)
                  };

                  this.abortRequest();
                  this.currentRequest = ds.request(requestConfig);
                }.bind(this)
              );
            }.bind(this)
          );
        }
      },

      getUrl: function() {
        return new Promise(
          function(resolve, reject) {
            resolve({
              url: UriTemplate(APIURLS[this.analysis.type]).fillFromObject(
                Object.assign({}, this.analysis, {
                  dataset:
                    this.analysis.type === 'country'
                      ? 'umd-loss-gain'
                      : this.analysis.dataset
                })
              )
            });
          }.bind(this)
        );
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
        if (status.dataset === 'umd-loss-gain') {
          period =
            status.begin +
            ',' +
            moment
              .utc(status.end)
              .subtract(1, 'days')
              .format('YYYY-MM-DD');
        }

        return _.extend(
          {},
          status,
          layerOptions,
          {
            country: status.iso.country,
            region: status.iso.region,
            subRegion: status.iso.subRegion,
            thresh: status.threshold,
            period: period,

            // If a userGeostore exists we need to set geostore and type manually
            geostore: status.useGeostore ? status.useGeostore : status.geostore,
            type: status.useGeostore ? 'use-geostore' : status.type
          },
          layerOptions
        );
      },

      getApiHost: function(dataset) {
        return this.analysis.type === 'country' ? APIURLV2 : APIURL;
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
  }
);
