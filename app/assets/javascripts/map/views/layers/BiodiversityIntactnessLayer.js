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
    'chroma-js',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/BiodiversityIntactnessLayerPresenter'
  ],
  function(_, d3, chroma, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var BiodiversityIntactness = CanvasLayerClass.extend({
      options: {
        dataMaxZoom: 12,
        urlTemplate:
          'https://storage.googleapis.com/wri-public/biodiversity/intactness/v1{/z}{/x}{/y}.png'
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
        var scale = chroma
          .scale([
            '#F8EBFF',
            '#ECCAFC',
            '#DFA4FF',
            '#C26DFE',
            '#9D36F7',
            '#6D00E1',
            '#3C00AB'
          ])
          .domain([40, 69, 78, 85, 95, 99, 100]);

        for (var i = 0; i < w; ++i) {
          for (var j = 0; j < h; ++j) {
            //maps over square
            var pixelPos = (j * w + i) * components;
            var intensity = imgdata[pixelPos + 1];

            var tmp_rgb = scale(intensity).rgb();
            imgdata[pixelPos] = tmp_rgb[0];
            imgdata[pixelPos + 1] = tmp_rgb[1];
            imgdata[pixelPos + 2] = tmp_rgb[2];
            imgdata[pixelPos + 3] = myscale(intensity) * 256;
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

    return BiodiversityIntactness;
  }
);
