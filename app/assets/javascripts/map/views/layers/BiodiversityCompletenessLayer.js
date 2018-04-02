/* eslint-disable */
/**
 * Modified from the Forest2010 layer
 *  https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4{/YYYY}{/z}{/x}{/y}.png
 * @return (extends CanvasLayerClass)
 */
define(
  [
    'underscore',
    'd3',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/BiodiversityCompletenessLayerPresenter'
  ],
  function(_, d3, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var BiodiversityCompleteness = CanvasLayerClass.extend({
      options: {
        urlTemplate:
          'https://storage.googleapis.com/wri-public/biodiversity/significance/all/loss/v1{/z}{/x}{/y}.png'
      },

      init: function(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
      },

      /**
       * Filters the canvas imgdata.
       * @override
       */
      filterCanvasImgdata: function(imgdata, w, h) {
        var components = 4;
        var zoom = this.map.getZoom();
        var exp = zoom < 11 ? 0.3 + (zoom - 3) / 20 : 1;

        var myscale = d3.scale
          .pow()
          .exponent(exp)
          .domain([0, 256])
          .range([0, 256]);

        for (var i = 0; i < w; ++i) {
          for (var j = 0; j < h; ++j) {
            //maps over square
            var pixelPos = (j * w + i) * components;
            var intensity = imgdata[pixelPos + 1];

            imgdata[pixelPos + 3] =
              zoom < 13 ? myscale(intensity) * 256 : intensity * 256;
          }
        }
      },

      _getUrl: function(x, y, z) {
        return new UriTemplate(this.options.urlTemplate).fillFromObject({
          x: x,
          y: y,
          z: z
        });
      }
    });

    return BiodiversityCompleteness;
  }
);
