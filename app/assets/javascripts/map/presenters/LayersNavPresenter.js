/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService'
], function(_, mps, PresenterClass, layerSpecService) {

  'use strict';

  var LayersNavPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this.view._toggleSelected(place.layerSpec.getLayers());
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this.view._toggleSelected(layerSpec.getLayers());
      }
    }, {
      'Layers/isos': function(layers_iso) {
        this.view._getIsoLayers(layers_iso);
      }
    }],

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
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


    /**
    * Ask for country analysis once clicked
    */
    _analizeIso: function(iso) {
      iso = {country: iso}
      mps.publish('LocalMode/changeIso',[iso])
    }
  });

  return LayersNavPresenter;
});
