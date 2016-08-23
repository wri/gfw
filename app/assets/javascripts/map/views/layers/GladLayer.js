define([
  'bluebird', 'uri', 'd3', 'mps', 'moment',
  'abstract/layer/AnimatedCanvasLayerClass',
  'map/services/GladDateService',
  'map/presenters/GladLayerPresenter'
], function(
  Promise, UriTemplate, d3, mps, moment,
  AnimatedCanvasLayerClass,
  GladDateService,
  Presenter
) {

  'use strict';

  var TILE_URL = 'http://wri-tiles.s3.amazonaws.com/glad_prod/tiles{/z}{/x}{/y}.png';
  var START_DATE = '2015-01-01';

  var padNumber = function(number) {
    var s = "00" + number;
    return s.substr(s.length - 3);
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
        (!!options.currentDate && !!options.currentDate[0]) ?
          moment.utc(options.currentDate[0]) : moment.utc(START_DATE),
        (!!options.currentDate && !!options.currentDate[1]) ?
          moment.utc(options.currentDate[1]) : moment.utc(),
      ];

      this.maxDate = this.currentDate[1];
    },

    _getLayer: function() {
      return new Promise(function(resolve) {

      var dateService = new GladDateService();

      dateService.fetchDates().then(function(response) {
        // Check max date
        this._checkMaxDate(response);
        mps.publish('Torque/date-range-change', [this.currentDate]);
        mps.publish('Place/update', [{go: false}]);

        resolve(this);
      }.bind(this));

      }.bind(this));
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(TILE_URL).fillFromObject({x: x, y: y, z: z});
    },

    _checkMaxDate: function(response) {
      var maxDataDate = moment.utc(response['max-date']);
      if (this.maxDate.isAfter(maxDataDate)) {
        this.maxDate = maxDataDate;
        this.currentDate[1] = this.maxDate;
      }
    },

    filterCanvasImgdata: function(imgdata, w, h, z) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment.utc(this.currentDate[0]),
          moment.utc(this.currentDate[1])];
      }

      var startYear = this.timelineExtent[0].year(),
          endYear = this.timelineExtent[1].year();
      var startDay = this.timelineExtent[0].dayOfYear() + ((startYear - 2015) * 365),
          endDay = this.timelineExtent[1].dayOfYear() + ((endYear - 2015) * 365);

      var recentRangeStart = this.maxDate.clone().subtract(7, 'days'),
          recentRangeStartYear = recentRangeStart.year();
      var recentRangeEnd = this.maxDate.clone(),
          recentRangeEndYear = recentRangeEnd.year();
      var recentRangeStartDay = recentRangeStart.dayOfYear() + ((recentRangeStartYear - 2015) * 365),
          recentRangeEndDay = recentRangeEnd.dayOfYear() + ((recentRangeEndYear - 2015) * 365);

      var confidenceValue = -1;
      if (this.presenter.status.get('hideUnconfirmed') === true) {
        confidenceValue = 1;
      }

      var pixelComponents = 4; // RGBA
      var pixelPos, i, j;
      for(i = 0; i < w; ++i) {
        for(j = 0; j < h; ++j) {
          pixelPos = (j * w + i) * pixelComponents;

          // find the total days of the pixel by
          // multiplying the red band by 255 and adding
          // the green band to that
          var day = imgdata[pixelPos] * 255 + imgdata[pixelPos+1];

          if (day >= startDay && day <= endDay) {
            var band3_str = padNumber(imgdata[pixelPos+2].toString());

            // Grab confidence (the first value) from this string
            // confidence is stored as 1/2, subtract one to make it 0/1
            var confidence = parseInt(band3_str[0], 10) - 1;

            if (confidence >= confidenceValue) {
              // Grab the raw intensity value from the pixel; ranges from 1 - 255
              var intensity_raw = parseInt(band3_str.slice(1, 3), 10);
              // Scale the intensity to make it visible
              var intensity = intensity_raw * 50;
              // Set intensity to 255 if it's > than that value
              if (intensity > 255) { intensity = 255; }

              if (day >= recentRangeStartDay && day <= recentRangeEndDay) {
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
          }

          imgdata[pixelPos + 3] = 0;
        }
      }
    }
  });

  return GladLayer;

});
