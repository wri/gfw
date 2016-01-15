/**
 * The UMD/GLAD layer module.
 */

define([
  'moment', 'd3',
  'abstract/layer/CartoDbCanvasLayerClass',
  'map/presenters/TorqueLayerPresenter'
], function(moment, d3, CartoDbCanvasLayerClass, Presenter) {

  'use strict';

  var AsItHappensLayer = CartoDbCanvasLayerClass.extend({

    table: 'umd_alerts_agg_rast',

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
    },

    /*
     * Takes an array of RGBA values for a map tile.
     *
     * Assuming that the day of the year is encoded in the R and G
     * channels, this method hides any pixels whose day of the year is
     * not within the current range selected by the user/timeline.
     *
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment(this.currentDate[0]),
          moment(this.currentDate[1])];
      }

      var startDay = this.timelineExtent[0].dayOfYear(),
          startYear = this.timelineExtent[0].year();
      var endYear = this.timelineExtent[1].year(),
          endDay = this.timelineExtent[1].dayOfYear() + ((endYear - 2015) * 365);

      // For normalising the intensity values
      // As it is stored in RGB (0..255), the intensity (opacity) is
      // outside the standard range of 0..1, and thus needs to be
      // rescaled.
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

          // The B channel represents the year than an alert occurred
          var yearOfLoss = imgdata[pixelPos+2] + 2015;
          // The R channel represents the day of the year that an alert
          // occurred, where `day <= 255`
          var dayOfLoss = imgdata[pixelPos];
          if (dayOfLoss === 0 && imgdata[pixelPos+1] !== 0) {
            // The G channel represents the day of year that an alert
            // occurred, where `day > 255`
            dayOfLoss = imgdata[pixelPos+1] + 255;
          }

          if (dayOfLoss >= startDay && yearOfLoss >= startYear && dayOfLoss <= endDay && yearOfLoss <= endYear) {
            // Arbitrary values to get the correct colours
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = (72 - z) + 102 - (3 * scale(intensity) / z);
            imgdata[pixelPos + 2] = (33 - z) + 153 - (intensity / z);
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    }

  });

  return AsItHappensLayer;

});
