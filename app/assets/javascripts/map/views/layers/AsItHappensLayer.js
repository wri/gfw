/**
 * The UMD/GLAD layer module.
 */

define([
  'moment',
  'abstract/layer/CartoDbCanvasLayerClass',
], function(moment, CartoDbCanvasLayerClass) {

  'use strict';

  var AsItHappensLayer = CartoDbCanvasLayerClass.extend({

    /*
     * Takes an array of RGBA values for a map tile.
     *
     * Assuming that the day of the year is encoded in the R and G
     * channels, this method hides any pixels whose day of the year is
     * not within the current range selected by the user/timeline.
     *
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      if (!moment.isMoment(this.currentDate[0])) {
        this.currentDate[0] = moment(this.currentDate[0]);
        this.currentDate[1] = moment(this.currentDate[1]);
      }

      var startDay = this.currentDate[0].dayOfYear();
      var endDay = this.currentDate[1].dayOfYear();

      var exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
      var scale = d3.scale.pow()
        .exponent(exp)
        .domain([0,256])
        .range([0,256]);

      var pixelComponents = 4; // RGBA
      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * pixelComponents;
          var intensity = 255;

          // The R channel represents the day of the year that an alert
          // occurred, where `doy <= 255`
          var dayOfLoss = imgdata[pixelPos];
          if (dayOfLoss == 0 && imgdata[pixelPos+1] !== 0) {
            // The G channel representst the day of year that an alert
            // occurred, where `doy > 255`
            dayOfLoss = imgdata[pixelPos+1] + 255;
          }

          if (dayOfLoss >= startDay && dayOfLoss < endDay) {
            // Arbitrary values to get the correct colours
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = (72 - z) + 102 - (3 * scale(intensity) / z);
            imgdata[pixelPos + 2] = (33 - z) + 153 - ((intensity) / z);
            imgdata[pixelPos + 3] = 255;
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    }

  });

  return AsItHappensLayer;

});
