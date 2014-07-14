/**
 * The Modis layer module.
 *
 * @return ModisLayer class (extends CartoDBLayerClass)
 */
define([
  'moment',
  'views/layers/class/CartoDBLayerClass',
  'presenters/ModisLayerPresenter',
  'text!cartocss/modis.cartocss'
], function(moment, CartoDBLayerClass, Presenter, modisCartoCSS) {

  'use strict';

  var ModisLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer FROM {tableName} ' +
        'WHERE EXTRACT(YEAR FROM DATE) = {endYear} ' +
        'AND EXTRACT(MONTH FROM DATE) = {endMonth}',
      cartocss: modisCartoCSS,
      interactivity: 'cartodb_id'
    },

    init: function(layer, map) {
      this._super(layer, map);
      this.timelineDate = [moment([2011, 9]), moment([2011, 11])];
      this.presenter = new Presenter(this);
    },

    /**
     * @override
     */
    getQuery: function() {
      var query = new UriTemplate(this.options.sql || this.queryTemplate).fillFromObject({
        tableName: this.layer.table_name,
        endYear: this.timelineDate[1].year(),
        // moment months index is 0 to 11. Add 1 so it match with the database.
        endMonth: this.timelineDate[1].month() + 1
      });

      return query;
    },

    /**
     * Used by ModisLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date) {
      this.timelineDate = date;
    }
  });

  return ModisLayer;
});
