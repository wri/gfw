/**
 * The Forma layer module for use on canvas.
 *
 * @return FormaLayer class (extends CanvasLayerClass)
 */
define([
  'moment',
  'abstract/layer/CanvasJSONLayerClass',
  'map/presenters/layers/FormaLayerPresenter'
], function(moment, CanvasJSONLayerClass, Presenter) {

  'use strict';

  var FormaLayer = CanvasJSONLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this.currentDate = options.currentDate || [moment(layer.mindate), moment(layer.maxdate)];
      this._super(layer, options, map);
    },

    /**
     * Used by UMDLoassLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date) {
      this.currentDate = date;
      this.updateTiles();
    }

  });

  return FormaLayer;

});
