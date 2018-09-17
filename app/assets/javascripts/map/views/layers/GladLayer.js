/* eslint-disable */
define(
  [
    'bluebird',
    'uri',
    'd3',
    'mps',
    'moment',
    'abstract/layer/AnimatedCanvasLayerClass',
    'map/services/GladDateService',
    'map/presenters/GladLayerPresenter'
  ],
  function(
    Promise,
    UriTemplate,
    d3,
    mps,
    moment,
    AnimatedCanvasLayerClass,
    GladDateService,
    Presenter
  ) {
    'use strict';
    var env =
      window.gfw.config.FEATURE_ENV === 'production' ? 'prod' : 'staging';
    var sourceUrl =
      env === 'staging'
        ? 'https://d178s5l0vmo3yy.cloudfront.net'
        : 'https://wri-tiles.s3.amazonaws.com';
    var TILE_URL = sourceUrl + '/glad_' + env + '/tiles{/z}{/x}{/y}.png';
    var START_DATE = '2015-01-01';

    var getConfidence = function(number) {
      var confidence = -1;
      if (number >= 100 && number < 200) {
        confidence = 0;
      } else if (number >= 200) {
        confidence = 1;
      }
      return confidence;
    };

    var getIntensity = function(number) {
      var intensity = (number % 100) * 50;
      if (intensity > 255) {
        intensity = 255;
      }
      return intensity;
    };

    var GladLayer = AnimatedCanvasLayerClass.extend({
      init: function(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
        this.presenter.setConfirmedStatus(options.layerOptions);
        this.options.showLoadingSpinner = true;
        this.options.dataMaxZoom = 12;
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

      _getLayer: function() {
        return new Promise(
          function(resolve) {
            var dateService = new GladDateService();

            dateService.fetchDates().then(
              function(response) {
                // Check max date
                this._checkMaxDate(response);
                mps.publish('Torque/date-range-change', [this.currentDate]);
                mps.publish('Place/update', [{ go: false }]);

                resolve(this);
              }.bind(this)
            );
          }.bind(this)
        );
      },

      _getUrl: function(x, y, z) {
        return new UriTemplate(TILE_URL).fillFromObject({ x: x, y: y, z: z });
      },

      _checkMaxDate: function(response) {
        this.maxDataDate = moment.utc(response.maxDate);
        if (this.maxDate.isAfter(this.maxDataDate)) {
          this.maxDate = this.maxDataDate;
          this.currentDate[1] = this.maxDate;
        }
      },

      filterCanvasImgdata: function(imgdata, w, h, z) {
        var imageData = imgdata;
        var startDate = moment(START_DATE);
        var endDate = this.maxDataDate;
        var numberOfDays = endDate.diff(startDate, 'days');
        var customRangeStartDate = numberOfDays - 7;

        if (this.timelineExtent === undefined) {
          this.timelineExtent = [
            moment.utc(this.currentDate[0]),
            moment.utc(this.currentDate[1])
          ];
        }

        var timeLinesStartDay = this.timelineExtent[0].diff(startDate, 'days');
        var timeLinesEndDay =
          numberOfDays - endDate.diff(this.timelineExtent[1], 'days');

        var confidenceValue = -1;
        if (this.presenter.status.get('hideUnconfirmed') === true) {
          confidenceValue = 1;
        }

        var pixelComponents = 4; // RGBA
        var pixelPos, i, j;
        for (i = 0; i < w; ++i) {
          for (j = 0; j < h; ++j) {
            pixelPos = (j * w + i) * pixelComponents;

            // find the total days of the pixel by
            // multiplying the red band by 255 and adding
            // the green band to that
            var day = imgdata[pixelPos] * 255 + imgdata[pixelPos + 1];
            var band3 = imgdata[pixelPos + 2];
            var confidence = getConfidence(band3);

            if (
              confidence >= confidenceValue &&
              day > 0 &&
              (day >= timeLinesStartDay && day <= timeLinesEndDay)
            ) {
              var intensity = getIntensity(band3);
              if (day >= numberOfDays - 7 && day <= numberOfDays) {
                imgdata[pixelPos] = 219;
                imgdata[pixelPos + 1] = 168;
                imgdata[pixelPos + 2] = 0;
                imgdata[pixelPos + 3] = intensity;
              } else {
                imgdata[pixelPos] = 220;
                imgdata[pixelPos + 1] = 102;
                imgdata[pixelPos + 2] = 153;
                imgdata[pixelPos + 3] = intensity;
              }

              continue;
            }

            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    });

    return GladLayer;
  }
);
