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
        // legends are going to be rewrite a bit, this will be cooler.
        this.view.update(layerSpec.getLayers(), layerSpec.layers);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this.view.update(place.params.layerSpec.getLayers(),
          place.params.layerSpec.layers);
      }, this));
    }
  });

  return LegendPresenter;
});
