/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

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
        this._updateLegend(layerSpec);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        var layerSpec = place.params.layerSpec;
        this._updateLegend(layerSpec);
      }, this));
    },

    _updateLegend: function(layerSpec) {
      this.view.update(layerSpec.getLayersByCategory());
    }
  });

  return LegendPresenter;
});
