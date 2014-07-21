/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisToolPresenter = Class.extend({

    datasets: {
      'umd_tree_loss_gain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts'
    },

    init: function(view) {
      this.view = view;
      this.baselayer = null;
      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this._setBaselayer(place.params.layerSpec);
      }, this));
    },

    _setBaselayer: function(layerSpec) {
      this.baselayer = _.first(_.intersection(
        _.pluck(layerSpec.getBaselayers(), 'slug'),
        _.keys(this.datasets)));

      this._setVisibility();
    },

    _setVisibility: function() {
      if (!this.baselayer) {
        this.view.model.set('hidden', true);
      } else {
        this.view.model.set('hidden', false);
      }
    },

    publishAnalysis: function(geom) {
      mps.publish('AnalysisService/get', [{
        dataset: this.datasets[this.baselayer],
        geojson: geom
      }]);
    }

  });

  return AnalysisToolPresenter;

});
