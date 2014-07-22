/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisResultsPresenter = Class.extend({

    datasets: {
      'umd-loss-gain': 'umd_tree_loss_gain',
      'forma-alerts': 'forma',
      'imazon-alerts': 'imazon',
      'nasa-active-fires': 'fires',
      'quicc-alerts': 'modis'
    },

    init: function(view) {
      this.view = view;
      this.layerSpec = null;
      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.layerSpec = place.params.layerSpec;
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.layerSpec = layerSpec;
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        this._handleResults(results);
      }, this));
    },

    _handleResults: function(results) {
      var layerSlug = this.datasets[results.dataset];
      var layer = this.layerSpec.getLayer(layerSlug);
      this.view.renderAnalysis(results, layer);
      mps.publish('Place/update', [{go: false}]);
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return AnalysisResultsPresenter;

});
