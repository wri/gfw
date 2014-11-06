/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService'
], function(_, Backbone, mps, PresenterClass, layerSpecService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layerSpec: null,
      threshold: null
    }
  });

  var LegendPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this.status.set('layerSpec', place.layerSpec);
        this.status.set('threshold', place.params.threshold);
        this._updateLegend();
        this._toggleSelected();
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
        this._updateLegend();
        this._toggleSelected();
      }
    }, {
      'AnalysisTool/stop-drawing': function() {
        this.view.model.set({
          hidden: false,
          forceHidden: false
        });
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        this.view.model.set({
          hidden: true,
          forceHidden: true
        });
      }
    }, {
      'Threshold/changed': function(threshold) {
        this.status.set('threshold', threshold);
        this.status.get('layerSpec') && this._updateLegend();
      }
    }],

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
    },

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },


  });

  return LegendPresenter;
});
