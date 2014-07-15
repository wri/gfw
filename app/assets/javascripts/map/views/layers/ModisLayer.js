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
      _.bindAll(this, 'setTimelineDate');
      this.presenter = new Presenter(this);
      this._super(layer, map);
      this._initTimelineDate();
    },

    /**
     * @override
     */
    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        endYear: this.timelineDate[1].year(),
        endMonth: this.timelineDate[1].month() + 1
      });

      return query;
    },

    _initTimelineDate: function() {
      this.setTimelineDate([moment(this.layer.maxdate).subtract('months', 2),
        moment(this.layer.maxdate)]);
    },

    /**
     * Used by ModisLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date, publish) {
      this.timelineDate = date;
    }
  });

  return ModisLayer;
});
