/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var LayersNavPresenter = Class.extend({

    /**
     * Initialize LayersNavPresenter.
     *
     * @param  {object} Instance of LayersNavView
     */
    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Map/toggle-layer', this.view._toggleSelected);
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerName
     */
    toggleLayer: function(layerName) {
      mps.publish('Map/toggle-layer', [layerName]);
    }
  });

  return LayersNavPresenter;
});
