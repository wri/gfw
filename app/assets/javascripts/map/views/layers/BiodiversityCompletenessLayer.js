import { BIODIVERSITY_INTACTNESS } from 'data/layers';

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
    'map/presenters/layers/BiodiversityCompletenessLayerPresenter'
  ],
  function(_, d3, chroma, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var BiodiversityCompleteness = CanvasLayerClass.extend({
      options: {
        dataMaxZoom: 12,
        urlTemplate: `https://api.resourcewatch.org/v1/layer/${
          BIODIVERSITY_INTACTNESS
        }/tile/gee/{z}/{x}/{y}`
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
