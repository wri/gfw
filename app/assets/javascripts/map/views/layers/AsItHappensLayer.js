/**
 * The UMD/GLAD layer module.
 */

define([
  'moment',
  'abstract/layer/CartoDbCanvasLayerClass',
  'map/presenters/TorqueLayerPresenter'
], function(moment, CartoDbCanvasLayerClass, Presenter) {

  'use strict';

  var AsItHappensLayer = CartoDbCanvasLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);

      this.options.animationDuration = 30;
    },

    _getLayer: function() {
      var promise = CartoDbCanvasLayerClass.prototype._getLayer.call(this);
      promise.then(function() {
        this._setupAnimation();
        this.start();
      }.bind(this));
      return promise;
    },

    _setupAnimation: function() {
      var startDate = moment(this.currentDate[0]),
          endDate = moment(this.currentDate[1]),
          numberOfDays = Math.abs(startDate.diff(endDate)) / 1000 / 3600 / 24;

      var fps = 60,
          duration = this.options.animationDuration,
          frameCount = fps * duration,
          numberOfDays = Math.abs(startDate.diff(endDate)) / 1000 / 3600 / 24,
          daysPerFrame = numberOfDays / frameCount;

      this.animationOptions = {
        numberOfDays: numberOfDays,
        daysPerFrame: daysPerFrame
      };

      this.presenter.animationStarted({
        start: startDate,
        end: endDate
      });
    },

    setDateRange: function(dates) {
      this.currentDate = dates;
      this._setupAnimation();
      this.start();
    },

    setDate: function(date) {
      this.stop();
      this.presenter.animationStopped();

      this.startDate = moment(date);
      this.currentOffset = this.roundedOffset = this.startDate.dayOfYear() - moment(this.currentDate[0]).dayOfYear();

      this.renderTime(this.startDate);
    },

    renderTime: function(time) {
      this.presenter.updateTimelineDate({time: time});
      this.timelineExtent = [moment(this.currentDate[0]), time];
      this.updateTiles();
    },

    start: function() {
      if (this.animationInterval !== undefined) { this.stop(); }

      if (this.startDate === undefined) {
        this.startDate = moment(this.currentDate[0]);
      }

      if (this.currentOffset === undefined) {
        this.currentOffset = 1;
        this.roundedOffset = 0;
      }

      var step = function(timestamp) {
        if (this.currentOffset > this.animationOptions.numberOfDays) {
          this.currentOffset = 1;
          this.roundedOffset = 0;
          this.startDate = moment(this.currentDate[0]);
        }

        if (Math.round(this.currentOffset) > this.roundedOffset) {
          this.startDate.add('days', 1);
          this.renderTime(this.startDate);
          this.roundedOffset = Math.round(this.currentOffset);
        }

        this.currentOffset += this.animationOptions.daysPerFrame;

        this.animationInterval = window.requestAnimationFrame(step);
      }.bind(this);

      this.animationInterval = window.requestAnimationFrame(step);
    },

    stop: function() {
      window.cancelAnimationFrame(this.animationInterval);
      delete this.animationInterval;
    },

    toggle: function() {
      if (this.animationInterval !== undefined) {
        this.stop();
      } else {
        this.start();
      }
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
      if (this.timelineExtent === undefined) { return; }

      var startDay = this.timelineExtent[0].dayOfYear();
      var endDay = this.timelineExtent[1].dayOfYear();

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
