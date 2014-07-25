/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/LayerSpecService'
], function(Class, _, mps, layerSpecService) {

  'use strict';

  var LegendPresenter = Class.extend({

    /**
     * Initialize LegendPresenter.
     *
     * @param  {object} Instance of LegendPresenter view
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
        console.log(layerSpec);
        // toggle selected layers
        this._updateLegend(layerSpec);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        var layerSpec = place.params.layerSpec;
        this._updateLegend(layerSpec);
      }, this));

      mps.subscribe('AnalysisTool/stop-drawing', _.bind(function() {
        this.view.model.set({hidden: false, forceHidden: false});
      }, this));

      mps.subscribe('AnalysisTool/start-drawing', _.bind(function() {
        this.view.model.set({hidden: true, forceHidden: true});
      }, this));
    },

    _updateLegend: function(layerSpec) {
      this.view.update(layerSpec.getLayersByCategory());
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggle(where, {},
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    }

  });

  return LegendPresenter;
});
