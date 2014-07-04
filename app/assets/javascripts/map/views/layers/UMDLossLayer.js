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
      dataMaxZoom: 12,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/gfw_loss_year{/z}{/x}{/y}.png'
    },

    init: function(layer) {
      this._super(layer);
      this.presenter = new Presenter(this);
    },

    /**
     * Implementation for CanvasLayerView.filterCanvasImgdata().
     *
     * @param  {[type]} imgdata [description]
     * @param  {[type]} w       [description]
     * @param  {[type]} h       [description]
     * @param  {[type]} z       [description]
     * @return {[type]}         [description]
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      var components = 4;

      var timelineDate = [2001, 2004];

      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * components,
              yearLoss = imgdata[pixelPos],
              yearStart = timelineDate[0],
              yearEnd = timelineDate[1];

          yearLoss = 2000 + yearLoss;

          if (imgdata[pixelPos + 1] > 10 && (yearLoss >= yearStart && yearLoss < yearEnd)) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = 102;
            imgdata[pixelPos + 2] = 153;
            imgdata[pixelPos + 3] = (z < 13) ? (12/z) * 255 : 255;
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
    }
  });

  return UMDLossLayer;

});
