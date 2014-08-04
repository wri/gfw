/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps'
], function(Class, _, Backbone, mps) {

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

      this.status = new (Backbone.Model.extend())({
        layerSpec: null
      });

      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.status.set('layerSpec', place.layerSpec);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.view.model.set('boxHidden', true);
      }, this));

      mps.subscribe('AnalysisService/get', _.bind(function() {
        this._renderLoading();
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        if (results.failure) {
          this._renderAnalysisFailure(results);
        } else {
          this._renderAnalysis(results);
        }
      }, this));
    },

    /**
     * Render an analysis from AnalysisService/results
     * @param  {Object} results
     */
    _renderAnalysis: function(results) {
      var layerSlug = this.datasets[results.meta.id];
      var layer = this.status.get('layerSpec').getLayer({slug: layerSlug});
      this.view.renderAnalysis(results, layer);
      mps.publish('Place/update', [{go: false}]);
    },

    _renderAnalysisFailure: function() {
      this.view.renderFailure();
    },

    _renderLoading: function() {
      this.view.renderLoading();
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return AnalysisResultsPresenter;

});
