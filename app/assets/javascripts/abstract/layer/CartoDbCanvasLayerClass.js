define([
  'jquery', 'moment', 'handlebars', 'uri', 'bluebird',
  'abstract/layer/CanvasLayerClass',
  'helpers/canvasCartoCSSHelper',
  'map/services/CartoDbLayerDateService', 'map/services/CartoDbLayerService', 'map/services/CartoDbNamedMapService',
  'text!map/queries/default_cartodb_canvas.sql.hbs'
], function(
  $, moment, Handlebars, UriTemplate, Promise,
  CanvasLayerClass,
  canvasCartoCSSHelper,
  CartoDbLayerDateService, CartoDbLayerService, CartoDbNamedMapService,
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

    _getUrl: function(x, y, z) {
      var url;
      if (z > 9) {
        url = this.options.rasterUrlTemplate;
      } else {
        url = this.options.pointsUrlTemplate;
      }

      return new UriTemplate(url).fillFromObject({x: x, y: y, z: z});
    },

    _getLayer: function() {
      return new Promise(function(resolve) {

      var dateConfigService = new CartoDbLayerDateService({
        dateAttribute: 'date',
        table: this.table });

      var context = this;
      dateConfigService.fetchLayerConfig().then(function(dates) {
        context.currentDate[1] = moment(dates.max_date);

        var namedMapConfigService = new CartoDbNamedMapService({
          table: context.table,
          namedMap: 'gfw_glad_as_it_happens_hybrid' });
        var pointsConfigService = new CartoDbLayerService(
          context._getSQL(), context._getCartoCSS());

        return Promise.all([
          pointsConfigService.fetchLayerConfig(),
          namedMapConfigService.fetchLayerConfig(),
        ]);
      }).then(function(layerConfig) {
        var pointsConfig = layerConfig[0],
            namedMapConfig = layerConfig[1];

        context.options.rasterUrlTemplate = 'https://' + namedMapConfig.cdn_url.https + '/wri-01/api/v1/map/' + namedMapConfig.layergroupid + '{/z}{/x}{/y}.png32';
        context.options.pointsUrlTemplate = 'https://' + pointsConfig.cdn_url.https + '/wri-01/api/v1/map/' + pointsConfig.layergroupid + '{/z}{/x}{/y}.png32';

        context._setupAnimation();

        resolve(context);
      });

      }.bind(this));
    },

    _getCartoCSS: function() {
      var startDate = moment('2015-01-01'),
          endDate = moment();

      return canvasCartoCSSHelper.generateDaily('date', startDate, endDate);
    },

    _getSQL: function() {
      var template = Handlebars.compile(SQL),
          sql = template({table: 'umd_alerts_agg_hybrid'});

      return sql;
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
