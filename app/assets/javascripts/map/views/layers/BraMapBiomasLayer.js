/* eslint-disable */
/**
 * Modified from the Forest2010 layer
 *  https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4{/YYYY}{/z}{/x}{/y}.png
 * @return (extends CanvasLayerClass)
 */
define([
    'underscore',
    'd3',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/BraMapBiomasLayerPresenter'
  ], function(_, d3, UriTemplate, CanvasLayerClass, Presenter) {

    'use strict';

    var BraMapBiomasLayer = CanvasLayerClass.extend({

      options: {
        year: 2000,
        urlTemplate: 'https://storage.googleapis.com/wri-public/mapbiomass/tiles/v4{/year}{/z}{/x}{/y}.png'
      },

      init: function(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
        this.year = options.year|| this.options.year;
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

      setYear: function(year) {
        this.year = year;
        this.presenter.updateLayer();
      },

      _getUrl: function(x, y, z) {
        console.log(this.year);
        console.log(this.threshold);
        return new UriTemplate(this.options.urlTemplate)
          .fillFromObject({x: x, y: y, z: z, year: this.year});
      }

    });

    return BraMapBiomasLayer;

  });
