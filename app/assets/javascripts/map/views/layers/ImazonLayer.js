/**
 * The Imazon layer module.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'moment',
  'uri',
  'views/layers/class/CartoDBLayerClass',
  'presenters/ImazonLayerPresenter'
], function(moment, UriTemplate, CartoDBLayerClass, Presenter) {

  'use strict';

  var ImazonLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, data_type AS layer, data_type AS name FROM {tableName} WHERE EXTRACT(YEAR FROM date) >= \'{startYear}\' AND EXTRACT(MONTH FROM date) >= \'{startMonth}\' AND EXTRACT(YEAR FROM date) <= \'{endYear}\' AND EXTRACT(MONTH FROM date) <= \'{endMonth}\''
    },

    init: function(layer, map) {
      this.presenter = new Presenter(this);
      this._super(layer, map);
      this.layer.currentDate = this.layer.currentDate || this.options.dateRange;
    },

    /**
     * Used by UMDLoassLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date) {
      this.layer.currentDate = date;
      this.updateTiles();
    },

    /**
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     * @override
     */
    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        startMonth: this.layer.currentDate[0].format('MM'),
        startYear: this.layer.currentDate[0].format('YYYY'),
        endMonth: this.layer.currentDate[1].format('MM'),
        endYear: this.layer.currentDate[1].format('YYYY')
      });
      return query;
    }
  });

  return ImazonLayer;

});
