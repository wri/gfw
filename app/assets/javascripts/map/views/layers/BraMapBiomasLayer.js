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
    'map/presenters/layers/BraMapBiomasLayerPresenter'
  ],
  function(_, d3, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var BraMapBiomasLayer = CanvasLayerClass.extend({
      options: {
        year: 2000,
        urlTemplate:
          'https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4{/year}{/z}{/x}{/y}.png'
      },

      init: function(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
        this.year = options.year || this.options.year;
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

            //Natural Forest
            if (imgdata[pixelPos] >= 3 && imgdata[pixelPos] <= 5) {
              imgdata[pixelPos] = 22;
              imgdata[pixelPos + 1] = 119;
              imgdata[pixelPos + 2] = 100;
            } else if (imgdata[pixelPos] === 9) {
              //Planted Forest
              imgdata[pixelPos] = 232;
              imgdata[pixelPos + 1] = 163;
              imgdata[pixelPos + 2] = 229;
            } else if (imgdata[pixelPos] === 11) {
              //Non-forest Wetlands
              imgdata[pixelPos] = 39;
              imgdata[pixelPos + 1] = 137;
              imgdata[pixelPos + 2] = 212;
            } else if (imgdata[pixelPos] === 12) {
              //Grassland
              imgdata[pixelPos] = 204;
              imgdata[pixelPos + 1] = 219;
              imgdata[pixelPos + 2] = 152;
            } else if (imgdata[pixelPos] === 13) {
              //Other Non-forest Vegetation
              imgdata[pixelPos] = 89;
              imgdata[pixelPos + 1] = 107;
              imgdata[pixelPos + 2] = 44;
            } else if (imgdata[pixelPos] === 15) {
              //Pasture
              imgdata[pixelPos] = 255;
              imgdata[pixelPos + 1] = 184;
              imgdata[pixelPos + 2] = 126;
            } else if (imgdata[pixelPos] === 18) {
              //Agriculture
              imgdata[pixelPos] = 210;
              imgdata[pixelPos + 1] = 169;
              imgdata[pixelPos + 2] = 101;
            } else if (imgdata[pixelPos] === 21) {
              //Pasture or Agriculture
              imgdata[pixelPos] = 232;
              imgdata[pixelPos + 1] = 176;
              imgdata[pixelPos + 2] = 113;
            } else if (imgdata[pixelPos] >= 22 && imgdata[pixelPos] <= 25) {
              //Non-vegetated Area
              imgdata[pixelPos] = 246;
              imgdata[pixelPos + 1] = 240;
              imgdata[pixelPos + 2] = 234;
            } else if (imgdata[pixelPos] === 26) {
              //Water Bodies
              imgdata[pixelPos] = 163;
              imgdata[pixelPos + 1] = 220;
              imgdata[pixelPos + 2] = 254;
            } else if (imgdata[pixelPos] === 27) {
              //Unobserved
              imgdata[pixelPos] = 235;
              imgdata[pixelPos + 1] = 236;
              imgdata[pixelPos + 2] = 236;
              imgdata[pixelPos + 3] = 0;
            } else if (
              imgdata[pixelPos] === 1 ||
              imgdata[pixelPos] === 2 ||
              imgdata[pixelPos] === 10 ||
              imgdata[pixelPos] === 14
            ) {
              //Unknown / No data
              imgdata[pixelPos] = 256;
              imgdata[pixelPos + 1] = 256;
              imgdata[pixelPos + 2] = 256;
              imgdata[pixelPos + 3] = 0;
            } else {
              imgdata[pixelPos] = 256;
              imgdata[pixelPos + 1] = 256;
              imgdata[pixelPos + 2] = 256;
              imgdata[pixelPos + 3] = 0;
            }
          }
        }
      },

      setYear: function(year) {
        this.year = year;
        this.presenter.updateLayer();
      },

      _getUrl: function(x, y, z) {
        return new UriTemplate(this.options.urlTemplate).fillFromObject({
          x: x,
          y: y,
          z: z,
          year: this.year
        });
      }
    });

    return BraMapBiomasLayer;
  }
);
