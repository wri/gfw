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

  });

  return SentinelTilesLayer;

});
