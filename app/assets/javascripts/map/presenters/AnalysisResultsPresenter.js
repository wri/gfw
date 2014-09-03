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

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layerSpec: null,
      analysis: false,
      isoTotalArea: null,
      disableUpdating: false
    }
  });

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
      this.status = new StatusModel();
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.status.set('layerSpec', place.layerSpec);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
      }, this));

      mps.subscribe('AnalysisService/get', _.bind(function() {
        this.view.renderLoading();
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        this._handleAnalysisResults(results);
      }, this));

      mps.subscribe('AnalysisResults/unavailable', _.bind(function() {
        this._handleAnalysisResults({unavailable: true});
      }, this));

      mps.subscribe('Timeline/date-change', _.bind(function() {
        this._updateAnalysis();
      }, this));

      mps.subscribe('Threshold/changed', _.bind(function() {
        this._updateAnalysis();
      }, this));

      mps.subscribe('Timeline/start-playing', _.bind(function() {
        this.status.set('disableUpdating', true);
      }, this));

      mps.subscribe('Timeline/stop-playing', _.bind(function() {
        this.status.set('disableUpdating', false);
        this._updateAnalysis();
      }, this));

      mps.subscribe('AnalysisTool/iso-drawn', _.bind(function(multipolygon) {
        this.status.set('isoTotalArea', this._getHectares(multipolygon));
      }, this));
    },

    /**
     * Handle analysis results from the supplied object.
     * This will render the analysis, failure or unavailable widget message.
     * In any case, the analysis status is set tu true because we keep the polygon.
     *
     * @param  {Object} results [description]
     */
    _handleAnalysisResults: function(results) {
      this.status.set('analysis', true);

      if (results.unavailable) {
        this.view.renderUnavailable();
      } else if (results.failure) {
        this.view.renderFailure();
      } else {
        this._renderAnalysis(results);
      }
    },

    /**
     * Render the analysis from the supplied AnalysisService
     * results object.
     *
     * @param  {Object} results Results object form the AnalysisService
     */
    _renderAnalysis: function(results) {
      // Get layer object
      var layerSlug = this.datasets[results.meta.id];
      var layer = this.status.get('layerSpec').getLayer({slug: layerSlug});

      // Unexpected results from successful request
      if (!layer) {
        this._handleAnalysisResults({failure: true});
        return;
      }

      var params = this._getAnalysisResource(results, layer);
      this.view.renderAnalysis(params);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Updates current analysis if it's permitted.
     */
    _updateAnalysis: function() {
      if (this.status.get('analysis') && !this.status.get('disableUpdating')) {
        mps.publish('AnalysisTool/update-analysis', []);
      }
    },

    /**
     * Delete the current analysis and abort the current
     * AnalysisService request.
     */
    deleteAnalysis: function() {
      this.status.set('analysis', false);
      this.view.model.set('boxHidden', true);
      mps.publish('AnalysisService/cancel', []);
      mps.publish('AnalysisResults/delete-analysis', []);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Get analysis resource params which are going to be
     * pass to the html to render the analysis results.
     *
     * @param  {Object} results Results object form the AnalysisService
     * @param  {Object} layer   The layer object
     * @return {Object}         Returns resource params
     */
    _getAnalysisResource: function(results, layer) {
      var p = {};

      p[layer.slug] = true;
      p.layer = layer;
      p.download = results.download_urls;

      console.log(results);

      var dateRange = [moment(results.params.begin), moment(results.params.end)];

      if (results.params.geojson) {
        p.totalArea = this._getHectares(results.params.geojson);
      } else if (results.params.iso) {
        p.totalArea = this.status.get('isoTotalArea') ? this.status.get('isoTotalArea') : 0;
      }

      if (layer.slug === 'umd_tree_loss_gain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year());
        p.lossAlerts = 0;
        p.gainAlerts = 0;
        p.threshold  = results.params.thresh || 10;

        if (results.years) {
          var years = _.range(dateRange[1].diff(dateRange[0], 'years')+1);
          _.each(years, function(i) {
            var year = _.findWhere(results.years, {year: dateRange[0].year() + i});
            if (!year) {return;}
            p.lossAlerts += year.loss;
            p.gainAlerts += year.gain;
          });
        }

        p.lossAlerts = p.lossAlerts.toLocaleString();
        p.gainAlerts = p.gainAlerts.toLocaleString();

        return p;
      }

      if (layer.slug === 'imazon') {
        p.degrad = (results.value[0]) ? Number(results.value[0].value).toLocaleString() : 0;
        p.defor = (results.value[1]) ? Number(results.value[1].value).toLocaleString() : 0;
      } else {
        p.totalAlerts = (results.value) ? Number(results.value).toLocaleString() : 0;
      }

      if (layer.slug === 'fires') {
        // The api resunts period as array or string.
        p.dateRange = _.isArray(results.period) ? results.period[0] : results.period;
      } else {
        p.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),
          dateRange[1].format('MMM-YYYY'));
      }
    },

    /**
     * Get total hectares from a geojson.
     *
     * @param  {Object} geojson  polygon/multipolygon
     * @return {String} hectares
     */
    _getHectares: function(geojson) {
      return (geojsonArea(geojson) / 10000).toLocaleString();
    }

  });

  return AnalysisResultsPresenter;

});
