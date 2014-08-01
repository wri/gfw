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

        if (!this.view.model.get('boxHidden')) {
          this._updateLayer();
        }
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.view.model.set('boxHidden', true);
      }, this));

      mps.subscribe('AnalysisService/get', _.bind(function(data) {
        this._renderLoading();
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        if (!results.failure) {
          this._renderAnalysis(results);
        } else {
          this._renderAnalysisFailure(results);
        }
      }, this));
    },

    /**
     * Render an analysis from AnalysisService/results
     * @param  {Object} results
     */
    _renderAnalysis: function(results) {
      console.log(results);
      var layerSlug = this.datasets[results.meta.id];
      var layer = this.status.get('layerSpec').getLayer({slug: layerSlug});
      this.view.renderAnalysis(results, layer);
      mps.publish('Place/update', [{go: false}]);
    },

    _renderAnalysisFailure: function(results) {
      this.view.renderFailure();
    },

    _renderLoading: function() {
      this.view.renderLoading();
    },

    _updateLayer: function() {
      mps.publish('AnalysisTool/update-analysis', []);
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return AnalysisResultsPresenter;

});
