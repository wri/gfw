define([
  'moment',
  'abstract/layer/CanvasLayerClass'
], function(
  moment,
  CanvasLayerClass
)  {

  'use strict';

  var CartoDbCanvasLayerClass = CanvasLayerClass.extend({
    init: function(layer, options, map) {
      options = options || {};

      this.currentDate = options.currentDate ||
        [moment.utc(layer.mindate || undefined), moment.utc()];

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
      this._setupAnimation();
      this.start();
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
          lastTimestamp = +new Date();

      var step = function() {
        var now = +new Date(),
            dt = now - lastTimestamp;
        this.animationOptions.currentOffset += dt;

        var duration = this.animationOptions.duration,
            currentOffset = this.animationOptions.currentOffset,
            daysToAdd = ((currentOffset % duration)/duration)*this.numberOfDays,
            currentDate = startDate.clone().add('days', daysToAdd);

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

    _drawCanvasImage: function(canvasData) {
      var canvas = canvasData.canvas,
          ctx = canvas.getContext('2d'),
          image = canvasData.image;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.filterCanvasImgdata(I.data, canvas.width, canvas.height, canvasData.z);
      ctx.putImageData(I, 0, 0);
    },

    filterCanvasImgdata: function() {
      throw('filterCanvasImgdata must be implemented');
    }

  });

  return CartoDbCanvasLayerClass;

});
