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


  });

  return AsItHappensRasterLayer;

});
