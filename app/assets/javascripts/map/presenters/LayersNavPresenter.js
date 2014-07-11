/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/LayerSpecService'
], function(Class, _, mps, layerSpecService) {

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
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.view._toggleSelected(layerSpec.getLayers());
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this.view._toggleSelected(place.params.layerSpec.getLayers());
      }, this));
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggleLayer(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    }
  });

  return LayersNavPresenter;
});
