/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define([
  'uri',
  'views/layers/class/CanvasLayerClass',
  'presenters/Forest2000LayerPresenter'
], function(UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var Forest2000Layer = CanvasLayerClass.extend({

    options: {
      dataMaxZoom: 12,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/tree_alpha_{threshold}{/z}{/x}{/y}.png'
    },

    init: function(layer, map) {
      this.presenter = new Presenter(this);
      this._super(layer, map);
      this.layer.threshold = this.layer.threshold || 10;
    },

    /**
     * Filters the canvas imagedata.
     * @override
     */
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
    },

    setThreshold: function(threshold) {
      this.layer.threshold = threshold;
      this.presenter.updateLayer();
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(this.options.urlTemplate)
        .fillFromObject({x: x, y: y, z: z, threshold: this.layer.threshold});
    }

  });

  return Forest2000Layer;

});
