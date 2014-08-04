/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'moment',
  'mps'
], function(Class, _, Backbone, moment, mps) {

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
        this.view.renderLoading();
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        if (results.failure) {
          this.view.renderFailure();
        } else if (results.unavailable) {
          this.view.renderUnavailable();
        } else {
          this._renderAnalysis(results);
        }
      }, this));
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Render an analysis from AnalysisService/results.
     *
     * @param  {Object} results
     */
    _renderAnalysis: function(results) {
      var layerSlug = this.datasets[results.meta.id];
      var layer = this.status.get('layerSpec').getLayer({slug: layerSlug});
      console.log(results);
      // Unexpected results from successful request
      if (!layer) {
        this._renderAnalysisFailure();
        return;
      }

      var dateRange = [moment(results.params.begin), moment(results.params.end)];
      var p = {};

      p[layerSlug] = true;
      p.layer = layer;
      p.download = results.download_urls;
      p.totalArea = (results.params.geojson) ? this._getAreaPolygon(results.params.geojson) : 0;

      if (layer.slug === 'umd_tree_loss_gain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year());
        p.lossAlerts = 0;
        p.gainAlerts = 0;
      }

      if (layer.slug === 'imazon') {
        p.degrad = Number(results.value[0].value).toLocaleString();
        p.defor = Number(results.value[1].value).toLocaleString();
      } else {
        p.totalAlerts = Number(results.value).toLocaleString();
      }

      if (layer.slug === 'fires') {
        // TODO => We could get current date label from Timeline/date-change
        // instead of doing this here.
        var diff = dateRange[1].diff(dateRange[0], 'days');
        var diffLabel = {
          2: 'Past 24 hours',
          3: 'Past 48 hours',
          4: 'Past 72 hours',
          8: 'Past week'
        };
        p.dateRange = diffLabel[diff];
      } else {
        p.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),
          dateRange[1].format('MMM-YYYY'));
      }

      this.view.renderAnalysis(p);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Get total area form a geojson.
     * https://github.com/maxogden/geojson-js-utils
     *
     * @param  {Object}  geojson
     * @return {Integer} total area
     */
    _getAreaPolygon: function(polygon) {
      var area = 0;
      var points = polygon.coordinates[0];
      var j = points.length - 1;
      var p1, p2;

      for (var i = 0; i < points.length; j = i++) {
        var pt = points[i];
        if (Array.isArray(pt[0])) {
          pt[1] = pt[0][1];
          pt[0] = pt[0][0];
        }
        p1 = {
          x: pt[1],
          y: pt[0]
        };
        p2 = {
          x: points[j][1],
          y: points[j][0]
        };
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
      }
      area /= 2;
      area = Math.abs(area);
      return Number(Math.ceil((area * 1000000) * 10) / 10).toLocaleString();
    }

  });

  return AnalysisResultsPresenter;

});
