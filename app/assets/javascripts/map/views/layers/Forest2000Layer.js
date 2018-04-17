/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define([
  'd3',
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/layers/Forest2000LayerPresenter'
], function(d3,UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var Forest2000Layer = CanvasLayerClass.extend({

    options: {
      threshold: 30,
      dataMaxZoom: 12,
      urlTemplate: 'https://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_{threshold}_2014{/z}{/x}{/y}.png'
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
    var exp = zoom < 11 ? 0.3 + ((zoom - 3) / 20) : 1;

    var myscale = d3.scale.pow()
          .exponent(exp)
          .domain([0,256])
          .range([0,256]);

    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {
        var pixelPos = (j*w + i) * components;
        var intensity = imgdata[pixelPos+1];

        imgdata[pixelPos] = 151;
        imgdata[pixelPos + 1] = 189;
        imgdata[pixelPos + 2] = 61;

        imgdata[pixelPos + 3] = zoom < 13 ? myscale(intensity)*0.8 : intensity*0.8;
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
