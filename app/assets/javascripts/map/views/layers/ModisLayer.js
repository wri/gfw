/**
 * The Modis layer module.
 *
 * @return ModisLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'moment',
  'uri',
  'abstract/layer/CartoDBLayerClass',
  'map/presenters/layers/ModisLayerPresenter',
  'text!map/cartocss/modis.cartocss'
], function(_, moment, UriTemplate, CartoDBLayerClass, Presenter, modisCartoCSS) {

  'use strict';

  var ModisLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer FROM {tableName} ' +
        'WHERE ST_Y(the_geom) <37 AND EXTRACT(YEAR FROM DATE) = {endYear} ' +
        'AND EXTRACT(MONTH FROM DATE) = {endMonth}',
      cartocss: modisCartoCSS,
      interactivity: 'cartodb_id'
    },

    init: function(layer, options, map) {
      _.bindAll(this, 'setCurrentDate');
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.setCurrentDate(options.currentDate ||
        [moment(this.layer.maxdate).subtract('months', 2), moment(this.layer.maxdate)]);
    },

    /**
     * @override
     */
    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        endYear: this.currentDate[1].year(),
        endMonth: this.currentDate[1].month() + 1
      });

      return query;
    },

    /**
     * Used by ModisLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setCurrentDate: function(date) {
      this.currentDate = date;
    }
  });

  return ModisLayer;
});
