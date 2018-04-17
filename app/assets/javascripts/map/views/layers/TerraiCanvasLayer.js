define(
  [
    'bluebird',
    'uri',
    'd3',
    'mps',
    'moment',
    'abstract/layer/AnimatedCanvasLayerClass',
    'map/services/TerraiDateService',
    'map/presenters/TerraILayerPresenter'
  ],
  (
    Promise,
    UriTemplate,
    d3,
    mps,
    moment,
    AnimatedCanvasLayerClass,
    TerraiDateService,
    Presenter
  ) => {
    const TILE_URL =
      'https://wri-tiles.s3.amazonaws.com/terrai_prod/tiles/{z}/{x}/{y}.png';
    const START_DATE = '2004-01-01';
    const START_YEAR = 2004;

    const TerraiCanvasLayer = AnimatedCanvasLayerClass.extend({
      init(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
        this.presenter.setConfirmedStatus(options.layerOptions);
        this.options.showLoadingSpinner = true;
        this.options.dataMaxZoom = 10;
        this._setupAnimation();

        this.currentDate = [
          !!options.currentDate && !!options.currentDate[0]
            ? moment.utc(options.currentDate[0])
            : moment.utc(START_DATE),
          !!options.currentDate && !!options.currentDate[1]
            ? moment.utc(options.currentDate[1])
            : moment.utc()
        ];

        this.maxDate = this.currentDate[1];
      },

      _getLayer() {
        return new Promise(
          ((resolve) => {
            const dateService = new TerraiDateService();

            dateService.fetchDates().then(
              (response) => {
                // Check max date
                this._checkMaxDate(response);
                mps.publish('Torque/date-range-change', [this.currentDate]);
                mps.publish('Place/update', [{ go: false }]);

                resolve(this);
              }
            );
          })
        );
      },

      _getUrl(x, y, z) {
        return new UriTemplate(TILE_URL).fillFromObject({ x, y, z });
      },

      _checkMaxDate(response) {
        const maxDataDate = moment.utc(response.maxDate);
        if (this.maxDate.isAfter(maxDataDate)) {
          this.maxDate = maxDataDate;
          this.currentDate[1] = this.maxDate;
        }
      },

      filterCanvasImgdata(imgdata, w, h, z) {
        if (this.timelineExtent === undefined) {
          this.timelineExtent = [
            moment.utc(this.currentDate[0]),
            moment.utc(this.currentDate[1])
          ];
        }

        const components = 4;
        const numCompletedYears =
          moment
            .utc()
            .subtract(1, 'year')
            .year() - START_YEAR;

        let start =
          (this.timelineExtent[0].year() - START_YEAR) * 23 +
          Math.floor(this.timelineExtent[0].dayOfYear() / 16 + 1);

        const end =
          (this.timelineExtent[1].year() - START_YEAR) * 23 +
          Math.floor(this.timelineExtent[1].dayOfYear() / 16 + 1);

        const recentStartRange =
          (this.maxDate.year() - START_YEAR) * 23 +
          Math.floor(
            this.maxDate
              .clone()
              .subtract(1, 'month')
              .dayOfYear() /
              16 +
              1
          );

        const recentEndRange =
          (this.maxDate.year() - START_YEAR) * 23 +
          Math.floor(this.maxDate.dayOfYear() / 16 + 1);

        if (start < 1) {
          start = 1;
        }

        for (let i = 0; i < w; ++i) {
          for (let j = 0; j < h; ++j) {
            const pixelPos = (j * w + i) * components;

            const r = imgdata[pixelPos];
            const g = imgdata[pixelPos + 1];
            const b = imgdata[pixelPos + 2];
            const intensity = Math.min(b * 4, 255);

            const timeLoss = r + g;

            if (timeLoss >= start && timeLoss <= end) {
              if (timeLoss >= recentStartRange && timeLoss <= recentEndRange) {
                imgdata[pixelPos] = 219;
                imgdata[pixelPos + 1] = 168;
                imgdata[pixelPos + 2] = 0;
                imgdata[pixelPos + 3] = intensity;
              } else {
                imgdata[pixelPos] = 220;
                imgdata[pixelPos + 1] = 102;
                imgdata[pixelPos + 2] = 153;
                imgdata[pixelPos + 3] = intensity;

                if (timeLoss > this.top_date) {
                  imgdata[pixelPos] = 233;
                  imgdata[pixelPos + 1] = 189;
                  imgdata[pixelPos + 2] = 21;
                  imgdata[pixelPos + 3] = intensity;
                }
              }
              continue;
            }

            imgdata[pixelPos + 3] = 0;
          }
        } // end first for loop
      }
    });

    return TerraiCanvasLayer;
  }
);
