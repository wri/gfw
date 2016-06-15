define([
  'bluebird', 'uri',
  'abstract/layer/AnimatedCanvasLayerClass',
  'map/presenters/TorqueLayerPresenter'
], function(
  Promise, UriTemplate,
  AnimatedCanvasLayerClass,
  Presenter
) {

  'use strict';

  var TILE_URL = 'http://wri-tiles.s3.amazonaws.com/glad_test/test2{/z}{/x}{/y}.png';

  var padNumber = function(number) {
    var s = "00" + number;
    return s.substr(s.length - 3);
  };

  var GladLayer = AnimatedCanvasLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this._setupAnimation();

      this.currentDate = [
        moment('2015-01-01'),
        moment()
      ];

      this.maxDate = moment();
    },

    _getLayer: function() {
      return Promise.resolve(this);
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(TILE_URL).fillFromObject({x: x, y: y, z: z});
    },

    decodeDate: function(r, g, b) {
      // find the total days of the pixel by
      // multiplying the red band by 255 and adding
      // the green band to that
      var total_days = r * 255 + g;

      // take the total days value and divide by 365 to
      // get the year_offset. Add 15 to this (i.e 0 + 15 = 2015)
      // or 1 + 15 = 2016
      var year = (parseInt(total_days / 365, 10) + 15);

      return [total_days, year];
    },

    decodeConfidence: function(r, g, b) {
      // Convert the blue band to string, leading
      // zeros if it's not currently three digits
      // this occurs very rarely; where there's an intensity
      // value but no date/confidence for it. Due to bilinear
      // resampling
      var band3_str = padNumber(b.toString());

      // Grab confidence (the first value) from this string
      // confidence is stored as 1/2, subtract one to make it 0/1
      return parseInt(band3_str[0], 10) - 1;
    },

    decodeIntensity: function(r, g, b) {
      // Convert the blue band to string, leading
      // zeros if it's not currently three digits
      // this occurs very rarely; where there's an intensity
      // value but no date/confidence for it. Due to bilinear
      // resampling
      var band3_str = padNumber(b.toString());

      // Grab the raw intensity value from the pixel; ranges from 1 - 55
      var intensity_raw = parseInt(band3_str.slice(1, 3), 10);

      // Scale the intensity to make it visible
      var intensity = intensity_raw * 50;

      // Set intensity to 255 if it's > than that value
      if (intensity > 255) {
        intensity = 255;
      }

      return intensity;
    },

    filterCanvasImgdata: function(imgdata, w, h) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment(this.currentDate[0]),
          moment(this.currentDate[1])];
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
          var date = this.decodeDate(imgdata[pixelPos],
            imgdata[pixelPos+1], imgdata[pixelPos+2]);
          var year = date[1],
              day = date[0];

          var confidence = this.decodeConfidence(imgdata[pixelPos],
            imgdata[pixelPos+1], imgdata[pixelPos+2]);

          if (day >= startDay && day <= endDay && confidence >= confidenceValue) {
            if (day >= recentRangeStartDay && day <= recentRangeEndDay) {
              imgdata[pixelPos] = 219;
              imgdata[pixelPos + 1] = 168;
              imgdata[pixelPos + 2] = 0;
            } else {
              imgdata[pixelPos] = 220;
              imgdata[pixelPos + 1] = 102;
              imgdata[pixelPos + 2] = 153;
            }
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    }
  });

  return GladLayer;

});
