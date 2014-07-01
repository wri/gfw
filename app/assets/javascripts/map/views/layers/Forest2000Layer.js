/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define([
  'views/layers/class/CanvasLayerClass'
], function(CanvasLayerClass) {

  'use strict';

  var Forest2000Layer = CanvasLayerClass.extend({

    init: function(layer) {
      this._super(layer);
      this.dataMaxZoom = 12;
      this._urlTemplate = 'http://earthengine.google.org/static/hansen_2013/tree_alpha{/z}{/x}{/y}.png';
    },

    filterCanvasImgdata: function(imgdata, w, h) {
      var components = 4,
        pixelPos, intensity;

      for (var i = 0; i < w; ++i) {
        for (var j = 0; j < h; ++j) {

          pixelPos = (j * w + i) * components,
          intensity = imgdata[pixelPos + 3];

          imgdata[pixelPos] = 0;
          imgdata[pixelPos + 1] = intensity * 0.7;
          imgdata[pixelPos + 2] = 0;
          imgdata[pixelPos + 3] = intensity * 0.7;
        }
      }
    }
  });

  return Forest2000Layer;

});
