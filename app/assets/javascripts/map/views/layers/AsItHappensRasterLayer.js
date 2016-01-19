/**
 * The UMD/GLAD layer module.
 */

define([
  'moment', 'd3', 'handlebars',
  'helpers/canvasRasterCartoCSSHelper',
  'map/services/CartoDbRasterLayerService',
  'map/views/layers/AsItHappensLayer',
  'map/presenters/TorqueLayerPresenter',
  'text!map/queries/default_raster_cartodb_canvas.sql.hbs'
], function(
  moment, d3, Handlebars,
  canvasCartoCSSHelper,
  CartoDbRasterLayerService,
  AsItHappensLayer,
  Presenter, SQL) {

  'use strict';

  var AsItHappensRasterLayer = AsItHappensLayer.extend({

    table: 'umd_alerts_agg_rast',

    _getLayer: function() {
      var deferred = new $.Deferred();

      var configService = new CartoDbRasterLayerService({
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

          // The R channel represents the day of the year that an alert
          // occurred, where `day <= 255`
          var dayOfLoss = imgdata[pixelPos];
          if (dayOfLoss === 0 && imgdata[pixelPos+1] !== 0) {
            // The G channel represents the day of year that an alert
            // occurred, where `day > 255`
            dayOfLoss = imgdata[pixelPos+1] + 255;
          }

          if (dayOfLoss >= startDay && dayOfLoss <= endDay) {
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

  return AsItHappensRasterLayer;

});
