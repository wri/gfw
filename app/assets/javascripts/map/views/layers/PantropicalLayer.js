/**
 * The Pantropical/biomass stock layer module for use on canvas.
 *
 * @return PantropicalLayer class (extends CartoDBLayerClass)
 */
define([
  'd3',
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/layers/Forest2000LayerPresenter'
], function(d3,UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var PantropicalLayer = CanvasLayerClass.extend({

    options: {
      threshold: 30,
      dataMaxZoom: 12,
      urlTemplate: 'http://storage.googleapis.com/earthenginepartners-wri/whrc-hansen-carbon-{threshold}-{z}{/x}{/y}.png'
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
      "use asm";
      // We'll force the use of a 32bit integer wit `value |0`
      // More info here: http://asmjs.org/spec/latest/ 
      var components = 4 | 0,
          w = w |0,
          j = j |0,
          zoom = this.map.getZoom(),
          exp = zoom < 11 ? 0.3 + ((zoom - 3) / 20) : 1 | 0;

      var myscale = d3.scale.pow()
            .exponent(exp)
            .domain([0,256])
            .range([0,256]);
      var c = [137, 81,  34,  0,    // first bucket
               137, 81,  34,  255,
               137, 81,  34,  230,
               148, 123, 75,  220,
               148, 123, 75,  200,
               157, 179, 138, 200,
               157, 179, 138, 255,
               21,  95,  8,   210]; // last bucket 
      var countBuckets = c.length / 4 |0; //4: four bands

      for(var i = 0 |0; i < w; ++i) {
        for(var j = 0 |0; j < h; ++j) {
          var pixelPos  = ((j * w + i) * components) |0,
              intensity = imgdata[pixelPos+2] |0;
             
          var intensity_scaled = myscale(intensity) |0,
          bucket = (~~(countBuckets * intensity_scaled / 256) * 4);

          imgdata[pixelPos] = c[bucket];
          imgdata[pixelPos + 1] = c[bucket + 1];
          imgdata[pixelPos + 2] = c[bucket + 2];
          imgdata[pixelPos + 3] = c[bucket + 3];
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

  return PantropicalLayer;

});
