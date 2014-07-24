/**
 * The Forma layer module for use on canvas.
 *
 * @return FormaLayer class (extends CanvasLayerClass)
 */
define([
  'moment',
  'views/layers/class/CanvasJSONLayerClass',
  'presenters/FormaLayerPresenter'
], function(moment, CanvasJSONLayerClass, Presenter) {

  'use strict';

  var FormaLayer = CanvasJSONLayerClass.extend({

    options: {
      dateRange: [moment([2006]), moment(2015)]
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

  return FormaLayer;

});
