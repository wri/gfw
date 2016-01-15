define([
  'moment', 'handlebars',
  'abstract/layer/CanvasLayerClass', 'helpers/canvasCartoCSSHelper',
  'map/services/CartoDbLayerService',
  'text!map/queries/default_cartodb_canvas.sql.hbs'
], function(
  moment, Handlebars,
  CanvasLayerClass, canvasCartoCSSHelper,
  CartoDbLayerService,
  SQL
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
        sql: this._getSQL(),
        cartocss: this._getCartoCSS(),
        dateAttribute: 'date',
        table: this.table
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

    _getCartoCSS: function() {
      var startDate = moment(this.layer.mindate),
          endDate = moment(this.layer.maxdate || undefined);

      return canvasCartoCSSHelper.generateDaily('date', startDate, endDate);
    },

    _getSQL: function() {
      var template = Handlebars.compile(SQL),
          sql = template({
            table: this.table
          });

      return sql;
    },

    _setupAnimation: function() {
      var startDate = moment(this.currentDate[0]),
          endDate = moment(this.currentDate[1]);

      var fps = 60,
          duration = 30,
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
        this.renderTime(moment(this.currentDate[1]));
        this.currentOffset = moment(this.currentDate[1]).dayOfYear();
        this.roundedOffset = 0;
      }

      var step = function() {
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
