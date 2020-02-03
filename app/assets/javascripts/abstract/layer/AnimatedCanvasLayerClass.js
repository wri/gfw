define([
  'moment',
  'abstract/layer/CanvasLayerClass'
], function(
  moment,
  CanvasLayerClass
)  {

  'use strict';

  var AnimatedCanvasLayerClass = CanvasLayerClass.extend({
    init: function(layer, options, map) {
      options = options || {};

      this.currentDate = options.currentDate ||
        [moment.utc(layer.mindate || undefined), (layer.maxdate || undefined)];

      this._super(layer, options, map);
    },

    _getLayer: function() {
      throw new Error('_getLayer must be implemented');
    },

    animationOptions: {
      duration: 15000,
      currentOffset: 0
    },

    _setupAnimation: function() {
      var startDate = this.currentDate[0];
      if (!moment.isMoment(startDate)) {
        startDate = moment.utc(startDate);
      }

      var endDate = this.currentDate[1];
      if (!moment.isMoment(endDate)) {
        endDate = moment.utc(endDate);
      }

      this.numberOfDays = Math.abs(startDate.diff(endDate)) / 1000 / 3600 / 24;
      this.animationOptions.currentOffset = 0;
      this.presenter.animationStarted({
        start: startDate,
        end: endDate
      });
    },

    setDateRange: function(dates) {
      this.currentDate = dates;
      this.presenter.updateTimelineDate({time: dates[0]});
      delete this.timelineExtent;
      this._setupAnimation();
      this.updateTiles();
      this.presenter.animationStopped();
    },

    setDate: function(date) {
      this.stop();
      this.presenter.animationStopped();

      var newDate = moment.utc(date);
      this.setOffsetFromDate(newDate);
      this.renderTime(newDate);
    },

    setOffsetFromDate: function(date) {
      var startDate = moment.utc(this.currentDate[0]),
          daysFromStart = Math.abs(startDate.diff(date)) / 1000 / 3600 / 24;
      this.animationOptions.currentOffset = (daysFromStart / this.numberOfDays) * this.animationOptions.duration;
    },

    renderTime: function(time) {
      this.presenter.updateTimelineDate({time: time});
      this.timelineExtent = [moment.utc(this.currentDate[0]), time];
      this.updateTiles();
    },

    start: function() {
      if (this.animationInterval !== undefined) { this.stop(); }

      var startDate = moment.utc(this.currentDate[0]),
          endDate = this.currentDate[1],
          lastTimestamp = +new Date();

      var step = function() {
        var now = +new Date(),
            dt = now - lastTimestamp;
        this.animationOptions.currentOffset += dt;
        if (this.animationOptions.currentOffset === this.animationOptions.duration) {
          this.animationOptions.currentOffset = 0;
        }

        var duration = this.animationOptions.duration,
            currentOffset = this.animationOptions.currentOffset,
            daysToAdd = (currentOffset/duration)*this.numberOfDays,
            currentDate = startDate.clone().add('days', daysToAdd);

        if (daysToAdd >= this.numberOfDays) {
          this.renderTime(endDate);
          this.presenter.animationStopped();
          this.animationOptions.currentOffset = 0;
          return this.stop();
        }

        this.renderTime(currentDate);

        lastTimestamp = now;
        this.animationInterval = window.requestAnimationFrame(step);
      }.bind(this);

      step();
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

    filterCanvasImgdata: function() {
      throw('filterCanvasImgdata must be implemented');
    }

  });

  return AnimatedCanvasLayerClass;

});
