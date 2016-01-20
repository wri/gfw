define([
  'moment', 'handlebars',
  'abstract/layer/CanvasLayerClass',
  'map/services/CartoDbLayerService'
], function(
  moment, Handlebars,
  CanvasLayerClass,
  CartoDbLayerService
)  {

  'use strict';

  var CartoDbCanvasLayerClass = CanvasLayerClass.extend({
    init: function(layer, options, map) {
      options = options || {};

      this.currentDate = options.currentDate ||
        [moment(layer.mindate || undefined), moment()];

      this._super(layer, options, map);
    },

    _getLayer: function() {
      var deferred = new $.Deferred();

      var configService = new CartoDbLayerService({
        dateAttribute: 'date',
        table: this.table,
        namedMap: 'gfw_glad_as_it_happens'
      });

      var context = this;
      configService.fetchLayerConfig().then(function(config) {
        var dates = config[0],
            layerConfig = config[1];

        context.currentDate[1] = moment(dates.rows[0].max_date);

        context.options.urlTemplate = 'https://' + layerConfig.cdn_url.https + '/wri-01/api/v1/map/' + layerConfig.layergroupid + '{/z}{/x}{/y}.png32';
        context._setupAnimation();
        deferred.resolve(context);
      });

      return deferred.promise();
    },

    animationOptions: {
      duration: 15000,
      currentOffset: 0
    },

    _setupAnimation: function() {
      var startDate = moment(this.currentDate[0]),
          endDate = moment(this.currentDate[1]);

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


      var newDate = moment(date);
      this.setOffsetFromDate(newDate);
      this.renderTime(newDate);
    },

    setOffsetFromDate: function(date) {
      var startDate = moment(this.currentDate[0]),
          daysFromStart = Math.abs(startDate.diff(date)) / 1000 / 3600 / 24;
      this.animationOptions.currentOffset = (daysFromStart / this.numberOfDays) * this.animationOptions.duration;
    },

    renderTime: function(time) {
      this.presenter.updateTimelineDate({time: time});
      this.timelineExtent = [moment(this.currentDate[0]), time];
      this.updateTiles();
    },

    start: function() {
      if (this.animationInterval !== undefined) { this.stop(); }

      var startDate = moment(this.currentDate[0]),
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
