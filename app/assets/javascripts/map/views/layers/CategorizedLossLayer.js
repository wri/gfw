/**
 * The Categorized UMD loss map layer view.
 *
 * @return CategorizedLossLayer class (extends CanvasLayerClass)
 */

const RGBS = [
  [0, 0, 255],
  [252, 13, 27],
  [253, 191, 45],
  [85, 129, 57],
  [127, 127, 127],
  [220, 102, 153],
  [0, 255, 0][(0, 0, 0)]
];

define(
  [
    'd3',
    'moment',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/UMDLossLayerPresenter'
  ],
  (d3, moment, UriTemplate, CanvasLayerClass, Presenter) => {
    const CategorizedLossLayer = CanvasLayerClass.extend({
      options: {
        threshold: 30,
        dataMaxZoom: 12,
        urlTemplate:
          'https://storage.googleapis.com/wri-public/lossyear_classification_map/gfw/tiles/hansen_world/v2/tc30{/z}{/x}{/y}.png',
        currentDate: ['2001-01-01', '2017-01-01']
      },

      init(layer, options, map) {
        this.presenter = new Presenter(this);
        if (
          !!options.currentDate &&
          options.currentDate[0] > options.currentDate[1]
        ) {
          let kllm = options.currentDate[1];
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
      filterCanvasImgdata(imgdata, w, h, z) {
        const components = 4;
        const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
        if (!this.currentDate[0]._d) {
          this.currentDate[0] = moment(this.currentDate[0]);
          this.currentDate[1] = moment(this.currentDate[1]);
        }
        const yearStart = this.currentDate[0].year();
        const yearEnd = this.currentDate[1].year();

        const myscale = d3.scale
          .pow()
          .exponent(exp)
          .domain([0, 256])
          .range([0, 256]);

        for (let i = 0; i < w; ++i) {
          for (let j = 0; j < h; ++j) {
            const pixelPos = (j * w + i) * components;
            const intensity = imgdata[pixelPos];
            let category_index = imgdata[pixelPos + 1];
            if (category_index == 0) {
              console.log('uncategorized (blue)');
            } else if (category_index > 6) {
              console.log('bad-category (black)');
              category_index = 7;
            }
            const rgb = RGBS[category_index];
            const yearLoss = 2000 + imgdata[pixelPos + 2];

            if (yearLoss >= yearStart && yearLoss < yearEnd) {
              imgdata[pixelPos] = rgb[0];
              imgdata[pixelPos + 1] =
                72 - z + rgb[1] - 3 * myscale(intensity) / z;
              imgdata[pixelPos + 2] = 33 - z + rgb[2] - intensity / z;
              imgdata[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity;
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
      setCurrentDate(date) {
        this.currentDate = date;
        this.updateTiles();
      },

      setThreshold(threshold) {
        this.threshold = threshold;
        this.presenter.updateLayer();
      },

      _getUrl(x, y, z) {
        return new UriTemplate(this.options.urlTemplate).fillFromObject({
          x,
          y,
          z,
          threshold: this.threshold
        });
      }
    });

    return CategorizedLossLayer;
  }
);
