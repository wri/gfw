define([
  'abstract/layer/ImageLayerClass',
  'map/services/SentinelService',
  'moment'
], function(
  ImageLayerClass,
  SentinelService,
  moment
) {

  'use strict';

  var START_DATE = '2015-01-01';

  var SentinelTilesLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://earthengine.googleapis.com/map/35a6c171ff17c43ce736ecc0991a0fc4/{z}/{x}/{y}?token=1ff775cea38b201ed5d02d044492a4b5',
      dataMaxZoom: 14
    },

    init: function(layer, options, map) {
      //this.presenter = new Presenter(this);
      this._super(layer, options, map);

      this.currentDate = [
        (!!options.currentDate && !!options.currentDate[0]) ?
          moment.utc(options.currentDate[0]) : moment.utc(START_DATE),
        (!!options.currentDate && !!options.currentDate[1]) ?
          moment.utc(options.currentDate[1]) : moment.utc(),
      ];

      this.maxDate = this.currentDate[1];
    },

    _getLayer: function() {
      return new Promise(function(resolve) {

        SentinelService.getTiles(
          this.map.getCenter().lat(),
          this.map.getCenter().lng(),
          '2017-03-01',
          '2017-03-10')
          .then(function(response) {
            this.options.urlTemplate = response.attributes.url_image;
            //this._checkMaxDate(response);
            //mps.publish('Torque/date-range-change', [this.currentDate]);
            //mps.publish('Place/update', [{go: false}]);

            resolve(this);
          }.bind(this));

      }.bind(this));
    },

    _checkMaxDate: function(response) {
      var maxDataDate = moment.utc(response.maxDate);
      if (this.maxDate.isAfter(maxDataDate)) {
        this.maxDate = maxDataDate;
        this.currentDate[1] = this.maxDate;
      }
    },

    _updateSource: function(x, y, z, params) {
      return new Promise(function(resolve, reject) {
        var url = 'https://staging-api.globalforestwatch.org/v1/sentinel-tiles?lat=-16.5&lon=26.5&start=2017-03-01&end=2017-03-10';
        var latitude = this.map.getCenter().lat();
        var longitude = this.map.getCenter().lng();
        var requestId = 'SENTINEL_' + latitude + '_'+longitude;
        this.defineRequest(requestId,
          url, { type: 'persist', duration: 1, unit: 'days' });
        var requestConfig = {
          resourceId: requestId,
          success: function(res, status) {
            var url = new UriTemplate(res.data.attributes.url_image).fillFromObject({
              x: x,
              y: y,
              z: z,
              sat: params.color_filter,
              cloud: params.cloud,
              mindate: params.mindate,
              maxdate: params.maxdate,
              sensor_platform: params.sensor_platform
            });
            resolve(url, status);
          }
        };

        ds.request(requestConfig);
      }.bind(this));
    },

  });

  return SentinelTilesLayer;

});
