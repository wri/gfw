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
  'mps',
  'geojsonArea'
], function(Class, _, Backbone, moment, mps, geojsonArea) {

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
        layerSpec: null,
        analysis: false,
        isoGeojson: null,
        disableUpdating: false
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

      mps.subscribe('AnalysisTool/iso-drawn', _.bind(function(multipolygon) {
        this.status.set('isoGeojson', multipolygon);
      }, this));

      mps.subscribe('Timeline/date-change', _.bind(function() {
        if (this.status.get('analysis') && !this.status.get('disableUpdating')) {
          mps.publish('AnalysisTool/update-analysis', []);
        }
      }, this));

      mps.subscribe('Timeline/start-playing', _.bind(function() {
        this.status.set('disableUpdating', true);
      }, this));

      mps.subscribe('Timeline/stop-playing', _.bind(function() {
        this.status.set('disableUpdating', false);
        if (this.status.get('analysis')) {
          mps.publish('AnalysisTool/update-analysis', []);
        }
      }, this));
    },

    deleteAnalysis: function() {
      this.status.set('analysis', false);
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
      // Unexpected results from successful request
      if (!layer) {
        this.renderFailure();
        return;
      }

      var dateRange = [moment(results.params.begin), moment(results.params.end)];
      var p = {};

      p[layerSlug] = true;
      p.layer = layer;
      p.download = results.download_urls;

      if (results.params.geojson) {
        p.totalArea = this._getAreaPolygon(results.params.geojson);
      } else if (results.params.iso) {
        p.totalArea = this.status.get('isoGeojson') ? this._getAreaMultipolygon(this.status.get('isoGeojson')) : 0;
      }

      if (layer.slug === 'umd_tree_loss_gain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year());
        p.lossAlerts = 0;
        p.gainAlerts = 0;
      }

      if (layer.slug === 'imazon') {
        p.degrad = (results.value[0]) ? Number(results.value[0].value).toLocaleString() : 0;
        p.defor = (results.value[1]) ? Number(results.value[1].value).toLocaleString() : 0;
      } else {
        p.totalAlerts = (results.value) ? Number(results.value).toLocaleString() : 0;
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
      this.status.set('analysis', true);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Generates a path from a Geojson.
     *
     * @param  {object} geojson
     * @return {array} paths
     */
    _geojsonToPath: function(geojson) {
      var coords = geojson.coordinates[0];
      return _.map(coords, function(g) {
        return new google.maps.LatLng(g[1], g[0]);
      });
    },


    _getAreaMultipolygon: function(geojson) {
      return (geometry(geojson) / 10000).toLocaleString();
    },

    /**
     * Get total area form a geojson.
     * https://github.com/maxogden/geojson-js-utils
     *
     * @param  {Object}  geojson
     * @return {Integer} total area
     */
    _getAreaPolygon: function(polygon) {
      return (geometry(polygon) / 10000).toLocaleString();
    }

  });

  return AnalysisResultsPresenter;

});
