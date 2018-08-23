/**
 * The UMD loss map layer view.
 *
 * @return LossLayer class (extends CanvasLayerClass)
 */
/*eslint-disable*/
define(
  [
    'd3',
    'moment',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/UMDLossLayerPresenter'
  ],
  function(d3, moment, UriTemplate, CanvasLayerClass, Presenter) {
    'use strict';

    var LossByDriverLayer = CanvasLayerClass.extend({
      options: {
        threshold: 30,
        dataMaxZoom: 4,
        urlTemplate:
          'https://storage.googleapis.com/wri-public/lossyear_classification_map/2017/gfw/tiles/hansen_world/v2/tc{threshold}{/z}{/x}{/y}.png',
        currentDate: ['2001-01-01', '2016-01-01']
      },

      init: function(layer, options, map) {
        this.presenter = new Presenter(this);
        if (
          !!options.currentDate &&
          options.currentDate[0] > options.currentDate[1]
        ) {
          var kllm = options.currentDate[1];
          options.currentDate[1] = options.currentDate[0];
          options.currentDate[0] = kllm;
          kllm = null;
        }
        this.currentDate = options.currentDate || [
          moment(layer.mindate),
          moment(layer.maxdate)
        ];
        this.threshold = options.threshold || this.options.threshold;
        this._super(layer, options, map);
      },

      /**
       * Filters the canvas imgdata.
       * @override
       */
      filterCanvasImgdata: function(imgdata, w, h, z) {
        var components = 4;
        var exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
        if (!!!this.currentDate[0]._d) {
          this.currentDate[0] = moment(this.currentDate[0]);
          this.currentDate[1] = moment(this.currentDate[1]);
        }
        var yearStart = this.currentDate[0].year();
        var yearEnd = this.currentDate[1].year();

        var myscale = d3.scale
          .pow()
          .exponent(exp)
          .domain([0, 256])
          .range([0, 256]);

        for (var i = 0; i < w; ++i) {
          for (var j = 0; j < h; ++j) {
            var pixelPos = (j * w + i) * components;
            var intensity = imgdata[pixelPos];
            var yearLoss = 2000 + imgdata[pixelPos + 2];
            var lossCat = imgdata[pixelPos + 1];
            var rgb = [255, 255, 255];

            if (lossCat === 1) {
              rgb = [244, 29, 54]; // commodities
            } else if (lossCat === 2) {
              rgb = [239, 211, 26]; // agri
            } else if (lossCat === 3) {
              rgb = [47, 191, 113]; // forestry
            } else if (lossCat === 4) {
              rgb = [173, 54, 36]; // fire
            } else if (lossCat === 5) {
              rgb = [178, 53, 204]; // urban
            }

            if (yearLoss >= yearStart && yearLoss < yearEnd) {
              imgdata[pixelPos] = rgb[0];
              imgdata[pixelPos + 1] = rgb[1];
              imgdata[pixelPos + 2] = rgb[2];
              imgdata[pixelPos + 3] = myscale(intensity) * 1.25;
            } else {
              imgdata[pixelPos + 3] = 0;
            }
          }
        }
      },

      /**
       * Used by UMDLoassLayerPresenter to set the dates for the tile.
       *
       * @param {Array} date 2D array of moment dates [begin, end]
       */
      setCurrentDate: function(date) {
        this.currentDate = date;
        this.updateTiles();
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

    return LossByDriverLayer;
  }
);
