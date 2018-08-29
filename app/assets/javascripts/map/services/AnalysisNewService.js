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

    var APIURLV2 = window.gfw.config.GFW_API + '/v3';
    var APIURL = window.gfw.config.GFW_API;

    var APIURLS = {
      draw: '/{dataset}{?geostore,period,thresh,gladConfirmOnly}',

      wdpaid: '/{dataset}/wdpa{/wdpaid}{?period,thresh,gladConfirmOnly}',

      country:
        '/{dataset}/admin{/country}{/region}{/subRegion}{?period,thresh,gladConfirmOnly,geostore}',

      // same as above
      use: '/{dataset}{?geostore,period,thresh,gladConfirmOnly}',
      'use-geostore': '/{dataset}{?geostore,period,thresh,gladConfirmOnly}'
    };

    var AnalysisService = Class.extend({
      get: function(status) {
        // draw
        // get v1 umdlossgain
        // get extra fetch from dataset

        // get both sets of params for umd loss fetch
        var initParams = this.buildAnalysisFromStatus(status);
        var params = Object.assign({}, initParams, {
          geostore: status.geostore || status.useGeostore,
          host:
            status.type === 'country' && status.dataset === 'umd-loss-gain'
              ? APIURLV2
              : APIURL
        });
        var umdParams = Object.assign({}, params, {
          dataset: 'umd-loss-gain',
          host: status.type === 'country' ? APIURLV2 : APIURL
        });

        // get host url based on type

        return fetch(
          umdParams.host +
            UriTemplate(APIURLS[params.type]).fillFromObject(umdParams)
        )
          .then(function(firstResponse) {
            return firstResponse.json();
          })
          .then(function(umdResponse) {
            return fetch(
              params.host +
                UriTemplate(APIURLS[params.type]).fillFromObject(params)
            )
              .then(function(secondResponse) {
                return secondResponse.json();
              })
              .then(function(extraResponse) {
                console.log('status', status);
                console.log('umd', umdResponse.data.attributes);
                console.log('extra', extraResponse.data.attributes);
                var umd = umdResponse.data.attributes;
                var extra = extraResponse.data.attributes;

                var umdData = {
                  areaHa: umd.areaHa || (umd.totals && umd.totals.areaHa) || 0,
                  gain: umd.gain || (umd.totals && umd.totals.gain) || 0,
                  loss: umd.loss || (umd.totals && umd.totals.loss) || 0,
                  treeExtent:
                    umd.treeExtent ||
                    (umd.totals && umd.totals.extent2000) ||
                    0,
                  treeExtent2010:
                    umd.treeExtent2010 ||
                    (umd.totals && umd.totals.extent2010) ||
                    0,
                  gladAlerts: (umd.totals && umd.totals.gladAlerts) || 0
                };
                var extraData = {
                  alerts:
                    extra.value || extra.alertCounts || umdData.gladAlerts,
                  loss:
                    extra.value ||
                    extra.alertCounts ||
                    umdData.gladAlerts ||
                    umdData.loss,
                  downloadUrls: extra.downloadUrls
                };
                var allData = {
                  data: {
                    attributes: Object.assign({}, umdData, extraData)
                  }
                };
                console.log(umdData, extraData, allData);
                return allData;
              })
              .catch(function(err) {
                console.log(err);
              });
          });
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
            geostore:
              status.useGeostore || status.isoGeostore || status.geostore,
            type:
              status.useGeostore || status.isoGeostore
                ? 'use-geostore'
                : status.type
          },
          layerOptions
        );
      }

      /**
       * Abort the current request if it exists.
       */
      // abortRequest: function() {
      //   if (this.currentRequest) {
      //     this.currentRequest.abort();
      //     this.currentRequest = null;
      //   }
      // }
    });

    return new AnalysisService();
  }
);
