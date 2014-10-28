/**
 * The UMD loss map layer view.
 *
 * @return LossLayer class (extends CanvasLayerClass)
 */
define([
  'd3',
  'moment',
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/UMDLossLayerPresenter'
], function(d3, moment, UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var LossLayer = CanvasLayerClass.extend({

    options: {
      threshold: 30,
      dataMaxZoom: 12,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/gfw_tree_loss_year_{threshold}{/z}{/x}{/y}.png'
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this.currentDate = options.currentDate || [moment(layer.mindate), moment(layer.maxdate)];
      this.threshold = options.threshold || this.options.threshold;
      this._super(layer, options, map);
    },

    /**
     * Filters the canvas imgdata.
     * @override
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      var components = 4;
      var exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
      var yearStart = this.currentDate[0].year();
      var yearEnd = this.currentDate[1].year();

      var myscale = d3.scale.pow()
          .exponent(exp)
          .domain([0,256])
          .range([0,256]);

      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * components;
          var intensity = imgdata[pixelPos];
          var yearLoss = 2000 + imgdata[pixelPos + 2];

          if (yearLoss >= yearStart && yearLoss < yearEnd) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = (72 - z) + 102 - (3 * myscale(intensity) / z);
            imgdata[pixelPos + 2] = (33 - z) + 153 - ((intensity) / z);
            imgdata[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity;
          } else {
            imgdata[pixelPos + 3] = 0;
          }

        }
      }
    },

    /**
     * Used by UMDLoassLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setCurrentDate: function(date) {
      this.currentDate = date;
      this.updateTiles();
    },

    setThreshold: function(threshold) {
      this.threshold = threshold;
      this.presenter.updateLayer();
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(this.options.urlTemplate)
        .fillFromObject({x: x, y: y, z: z, threshold: this.threshold});
    }

  });

  return LossLayer;
});
