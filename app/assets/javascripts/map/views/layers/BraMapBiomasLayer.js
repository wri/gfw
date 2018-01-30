/* eslint-disable */
/**
 * Modified from the Forest2010 layer
 *  https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4{/YYYY}{/z}{/x}{/y}.png
 * @return (extends CanvasLayerClass)
 */
define(
  [
    'd3',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/Forest2010LayerPresenter'
  ],
  function(d3, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var BraMapBiomasLayer = CanvasLayerClass.extend({
      options: {
        dataMaxZoom: 12,
        urlTemplate:
          'https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4/2016{/z}{/x}{/y}.png'
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

            //Natural Forest
            if (imgdata[pixelPos] >= 3 && imgdata[pixelPos] <= 5) {
              imgdata[pixelPos] = 22;
              imgdata[pixelPos + 1] = 99;
              imgdata[pixelPos + 2] = 61;
            } else if (imgdata[pixelPos] === 9) {
              //Planted Forest
              imgdata[pixelPos] = 219;
              imgdata[pixelPos + 1] = 132;
              imgdata[pixelPos + 2] = 215;
            } else if (imgdata[pixelPos] === 11) {
              //Non-forest Wetlands
              imgdata[pixelPos] = 41;
              imgdata[pixelPos + 1] = 210;
              imgdata[pixelPos + 2] = 171;
            } else if (imgdata[pixelPos] === 12) {
              //Grassland
              imgdata[pixelPos] = 195;
              imgdata[pixelPos + 1] = 237;
              imgdata[pixelPos + 2] = 97;
            } else if (imgdata[pixelPos] === 13) {
              //Other Non-forest Vegetation
              imgdata[pixelPos] = 110;
              imgdata[pixelPos + 1] = 162;
              imgdata[pixelPos + 2] = 36;
            } else if (imgdata[pixelPos] === 15) {
              //Pasture
              imgdata[pixelPos] = 205;
              imgdata[pixelPos + 1] = 125;
              imgdata[pixelPos + 2] = 40;
            } else if (imgdata[pixelPos] === 18) {
              //Agriculture
              imgdata[pixelPos] = 251;
              imgdata[pixelPos + 1] = 240;
              imgdata[pixelPos + 2] = 171;
            } else if (imgdata[pixelPos] === 21) {
              //Pasture or Agriculture
              imgdata[pixelPos] = 244;
              imgdata[pixelPos + 1] = 214;
              imgdata[pixelPos + 2] = 52;
            } else if (imgdata[pixelPos] >= 22 && imgdata[pixelPos] <= 25) {
              //Non-vegetated Area
              imgdata[pixelPos] = 209;
              imgdata[pixelPos + 1] = 211;
              imgdata[pixelPos + 2] = 211;
            } else if (imgdata[pixelPos] === 26) {
              //ater Bodies
              imgdata[pixelPos] = 39;
              imgdata[pixelPos + 1] = 132;
              imgdata[pixelPos + 2] = 188;
            } else if (imgdata[pixelPos] === 27) {
              //Unobserved
              imgdata[pixelPos] = 92;
              imgdata[pixelPos + 1] = 96;
              imgdata[pixelPos + 2] = 96;
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

      setThreshold: function(threshold) {
        this.threshold = threshold;
        this.presenter.updateLayer();
      },

      _getUrl: function(x, y, z) {
        return new UriTemplate(this.options.urlTemplate).fillFromObject({
          x: x,
          y: y,
          z: z,
          threshold: this.threshold
        });
      }
    });

    return BraMapBiomasLayer;
  }
);
