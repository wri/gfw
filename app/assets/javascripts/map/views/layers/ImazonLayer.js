/**
 * The Imazon layer module.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'moment',
  'views/layers/class/CartoDBLayerClass',
  'presenters/ImazonLayerPresenter'
], function(moment, CartoDBLayerClass, Presenter) {

  'use strict';

  var ImazonLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, data_type AS layer, data_type AS name FROM {tableName}'
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
    }

  });

  return ImazonLayer;

});
