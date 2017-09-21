define([
  'mps',
  'abstract/layer/ImageLayerClass',
  'map/services/SentinelService',
  'moment'
], function(
  mps,
  ImageLayerClass,
  SentinelService,
  moment
) {

  'use strict';

  var START_DATE = '2015-01-01';

  var SentinelTilesLayer = ImageLayerClass.extend({

    options: {
      dataMaxZoom: 14
    },

    init: function(layer, options, map) {
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
          this.map.getCenter().lng(),
          this.map.getCenter().lat(),
          '2017-06-01',
          '2017-09-01')
          .then(function(response) {
            this.options.urlTemplate = response.attributes.url_image;
            resolve(this);
          }.bind(this));

      }.bind(this));
    }

  });

  return SentinelTilesLayer;

});
