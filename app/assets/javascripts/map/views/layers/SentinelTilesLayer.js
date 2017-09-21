define([
  'mps',
  'moment',
  'abstract/layer/ImageLayerClass',
  'map/services/SentinelService',
  'map/presenters/SentinelTilesLayerPresenter'
], function(
  mps,
  moment,
  ImageLayerClass,
  SentinelService,
  Presenter
) {

  'use strict';

  var SentinelTilesLayer = ImageLayerClass.extend({

    options: {
      dataMaxZoom: 14
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.currentDate = [
        (!!options.currentDate && !!options.currentDate[0]) ?
          moment.utc(options.currentDate[0]) : moment.utc().subtract(4, 'month'),
        (!!options.currentDate && !!options.currentDate[1]) ?
          moment.utc(options.currentDate[1]) : moment.utc(),
      ];
    },

    _getLayer: function() {
      return new Promise(function(resolve) {
        SentinelService.getTiles(
          this.map.getCenter().lng(),
          this.map.getCenter().lat(),
          this.currentDate[0].format('YYYY-MM-DD'),
          this.currentDate[1].format('YYYY-MM-DD'))
          .then(function(response) {
            this.options.urlTemplate = response.attributes.url_image;
            resolve(this);
          }.bind(this));

      }.bind(this));
    },

    setCurrentDate: function (date) {
      this.currentDate = date;
    }

  });

  return SentinelTilesLayer;

});
