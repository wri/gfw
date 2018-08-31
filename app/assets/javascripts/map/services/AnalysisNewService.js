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
          useGeostore: status.useGeostore,
          host:
            status.type === 'country' &&
            status.dataset === 'umd-loss-gain' &&
            !status.iso.subRegion
              ? APIURLV2
              : APIURL,
          type:
            status.iso &&
            status.iso.country &&
            status.iso.region &&
            !status.iso.subRegion
              ? 'country'
              : status.type
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
                UriTemplate(
                  APIURLS[!status.iso.subRegion ? params.type : 'draw']
                ).fillFromObject(params)
            )
              .then(function(secondResponse) {
                return secondResponse.json();
              })
              .then(function(extraResponse) {
                var umd =
                  (umdResponse.data && umdResponse.data.attributes) || {};
                var extra =
                  (extraResponse.data && extraResponse.data.attributes) || {};

                var alerts = status.dataset === 'imazon-alerts' ? {} : 0;

                if (status.dataset === 'imazon-alerts') {
                  if (extra.value[0]) {
                    alerts[extra.value[0].dataType] = extra.value[0].value || 0;
                  }
                  if (extra.value[1]) {
                    alerts[extra.value[1].dataType] = extra.value[1].value || 0;
                  }
                } else {
                  alerts = extra.value || extra.alertCounts || 0;
                }

                var data = {
                  data: {
                    attributes: {
                      areaHa:
                        umd.areaHa || (umd.totals && umd.totals.areaHa) || 0,
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
                      alerts: alerts,
                      // value: alerts,
                      downloadUrls: extra.downloadUrls
                    }
                  }
                };
                return data;
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
    });

    return new AnalysisService();
  }
);
