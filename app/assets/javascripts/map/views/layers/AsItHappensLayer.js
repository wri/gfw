/**
 * The UMD/GLAD layer module.
 */

define([
  'abstract/layer/CartoDbCanvasLayerClass',
], function(CartoDbCanvasLayerClass) {

  'use strict';

  var AsItHappensLayer = CartoDbCanvasLayerClass.extend({

    filterCanvasImgdata: function(imgdata, w, h, z) {
      var components = 4;

      this.currentDate[0] = moment(this.currentDate[0]);
      this.currentDate[1] = moment(this.currentDate[1]);

      var startDay = this.currentDate[0].dayOfYear();
      var endDay = this.currentDate[1].dayOfYear();

      var exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
      var myscale = d3.scale.pow()
          .exponent(exp)
          .domain([0,256])
          .range([0,256]);

      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * components;
          var intensity = 255;

          var dayOfLoss = imgdata[pixelPos];
          if (dayOfLoss == 0) {
            dayOfLoss = imgdata[pixelPos+1];
          }

          if (dayOfLoss >= startDay && dayOfLoss < endDay) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = (72 - z) + 102 - (3 * myscale(intensity) / z);
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
