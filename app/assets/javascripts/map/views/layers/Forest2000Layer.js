/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define([
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/Forest2000LayerPresenter'
], function(UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var Forest2000Layer = CanvasLayerClass.extend({

    options: {
      threshold: 10,
      dataMaxZoom: 12,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/gfw_tree_loss_year_{threshold}{/z}{/x}{/y}.png'
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.threshold = options.threshold || this.options.threshold;
    },

    /**
     * Filters the canvas imgdata.
     * @override
     */
    filterCanvasImgdata: function(imgdata, w, h) {
    var components = 4;
    var zoom = this.map.getZoom();

    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {
        var pixelPos = (j*w + i) * components;
        var intensity = imgdata[pixelPos+1];

        imgdata[pixelPos] = 151;
        imgdata[pixelPos + 1] = 189;
        imgdata[pixelPos + 2] = 61;

        if (zoom < 13) {
          imgdata[pixelPos+ 3] = intensity*0.8;
        } else {
          imgdata[pixelPos+ 3] = intensity*0.8;
        }
      }
    }
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

  return Forest2000Layer;

});
