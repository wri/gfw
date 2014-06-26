/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayer)
 */
define([
  'backbone',
  'mps',
  'presenter',
  'views/layers/core/canvasLayer',
], function(Backbone, mps, presenter, CanvasLayer) {

  'use strict';

  var ForestLayer = CanvasLayer.extend({

    initialize: function() {
      this.dataMaxZoom = 12;
      this.name = 'forest2000';
      this.url =
        'http://earthengine.google.org/static/hansen_2013/tree_alpha/%z/%x/%y.png';
      ForestLayer.__super__.initialize.apply(this);
    },

    filterCanvasImage: function(imgdata, w, h) {
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

  return ForestLayer;

});
