/**
 * The UMD loss map layer view.
 *
 * @return UMDLossLayer class (extends CanvasLayerClass)
 */
define([
  'moment',
  'views/layers/class/CanvasLayerClass',
  'presenters/UMDLossLayerPresenter'
], function(moment, CanvasLayerClass, Presenter) {

  'use strict';

  var UMDLossLayer = CanvasLayerClass.extend({

    options: {
      dateRange: [moment([2001]), moment()],
      dataMaxZoom: 12,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/gfw_tree_loss_year_{threshold}{/z}{/x}{/y}.png'
    },

    init: function(layer, map) {
      this.timelineDate = layer.currentDate || this.options.dateRange;
      this.presenter = new Presenter(this);
      this._super(layer, map);
      this.layer.threshold = this.layer.threshold || 10;
    },

    /**
     * Filters the canvas imgdata.
     * @override
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      var components = 4;
      var exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
      var yearStart = this.timelineDate[0].year();
      var yearEnd = this.timelineDate[1].year();

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
    setTimelineDate: function(date) {
      this.timelineDate = date;
      this.updateTiles();
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(this.options.urlTemplate)
        .fillFromObject({x: x, y: y, z: z, threshold: this.layer.threshold});
    }

  });

  return UMDLossLayer;
});
