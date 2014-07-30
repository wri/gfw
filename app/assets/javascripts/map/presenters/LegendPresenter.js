/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps',
  'services/LayerSpecService'
], function(Class, _, Backbone, mps, layerSpecService) {

  'use strict';

  var LegendPresenter = Class.extend({

    /**
     * Initialize LegendPresenter.
     *
     * @param  {object} Instance of LegendPresenter view
     */
    init: function(view) {
      this.view = view;

      this.status = new (Backbone.Model.extend())({
        layerSpec: null,
        threshold: null
      });

      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.status.set('layerSpec', place.layerSpec);
        this.status.set('threshold', place.params.threshold);
        this._updateLegend();
        this._toggleSelected();
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
        this._updateLegend();
        this._toggleSelected();
      }, this));

      mps.subscribe('AnalysisTool/stop-drawing', _.bind(function() {
        this.view.model.set({hidden: false, forceHidden: false});
      }, this));

      mps.subscribe('AnalysisTool/start-drawing', _.bind(function() {
        this.view.model.set({hidden: true, forceHidden: true});
      }, this));

      mps.subscribe('Threshold/changed', _.bind(function(threshold) {
        this.status.set('threshold', threshold);
        this.status.get('layerSpec') && this._updateLegend();
      }, this));
    },

    /**
     * Update legend by calling view.update.
     */
    _updateLegend: function() {
      var categories = this.status.get('layerSpec').getLayersByCategory();

      var options = {
        threshold: this.status.get('threshold')
      };

      this.view.update(categories, options);
    },

    /**
     * Toggle selected class sublayers by calling view.toggleSelected.
     */
    _toggleSelected: function() {
      this.view.toggleSelected(this.status.get('layerSpec').getLayers());
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    }

  });

  return LegendPresenter;
});
