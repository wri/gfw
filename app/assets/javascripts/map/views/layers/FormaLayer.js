/**
 * The Forma layer module for use on canvas.
 *
 * @return FormaLayer class (extends CanvasLayerClass)
 */
define([
  'bluebird', 'uri', 'd3', 'mps', 'moment',
  'abstract/layer/AnimatedCanvasLayerClass',
  'map/presenters/layers/FormaLayerPresenter'
], function(
  Promise, UriTemplate, d3, mps, moment,
  AnimatedCanvasLayerClass,
  Presenter
) {

  'use strict';

  var TILE_URL = 'https://storage.googleapis.com/forma-2016/projects/wri-datalab/f250_biweekly_alerts_2014{/z}{/x}{/y}';
  var START_DATE = '2010-01-01';
  var END_DATE = '2015-01-01';
  var START_YEAR = 2010;

  var FormaLayer = AnimatedCanvasLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.options.showLoadingSpinner = true;
      this.options.dataMaxZoom = 9;
      this._setupAnimation();

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
        this._checkMaxDate();
        mps.publish('Place/update', [{
          go: false
        }]);

        resolve(this);
      }.bind(this));
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(TILE_URL).fillFromObject({
        x: x,
        y: y,
        z: z
      });
    },

    _checkMaxDate: function() {
      var maxDataDate = moment.utc(END_DATE);
      if (this.maxDate.isAfter(maxDataDate)) {
        this.maxDate = maxDataDate;
        this.currentDate[1] = this.maxDate;
      }
    },

    setCurrentDate: function(date) {
      this.timelineExtent[0] = date[0];
      this.timelineExtent[1] = date[1];
      this.updateTiles();
    },

    filterCanvasImgdata: function(imgdata, w, h, z) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment.utc(this.currentDate[0]),
          moment.utc(this.currentDate[1])
        ];
      }

      var components = 4;
      var baseDate = moment.utc(START_DATE);
      var startDate = this.timelineExtent[0];
      var endDate = this.timelineExtent[1];
      var start = Math.abs(baseDate.diff(startDate, 'days'));
      var end = Math.abs(baseDate.diff(endDate, 'days'));

      for (var i = 0; i < w; ++i) {
        for (var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * components;
          var r = imgdata[pixelPos];
          var g = imgdata[pixelPos + 1];
          var b = imgdata[pixelPos + 2];
          var timeLoss = (b + 256) * g;
          var intensity = 0;

          if (r > 0 || g > 0) {
            intensity = 255;
          }

          if (timeLoss >= start && timeLoss <= end) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = 102;
            imgdata[pixelPos + 2] = 153;
            imgdata[pixelPos + 3] = intensity;

            continue;
          }
          imgdata[pixelPos + 3] = 0;
        }
      }
    }
  });

  return FormaLayer;

});
