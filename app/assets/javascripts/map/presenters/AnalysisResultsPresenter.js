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
        this._renderResults({loading: true});
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        this._renderResults(results);
      }, this));

      mps.subscribe('AnalysisResults/unavailable', _.bind(function() {
        this._renderResults({unavailable: true});
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
     *
     * @param  {Object} results [description]
     */
    _renderResults: function(results) {
      // Even if the result is a failure or unavailable message, we render
      // the widget results and keep the polygon.
      this.status.set('analysis', true);
      this.view.model.set('boxHidden', false);

      if (results.loading) {
        this.view.renderLoading();
      } else if (results.unavailable) {
        this.view.renderUnavailable();
      } else if (results.failure) {
        this.view.renderFailure();
      } else {
        this._renderAnalysis(results);
      }
    },

    /**
     * Get layer object from datasetId.
     *
     * @param  {String} datasetId
     */
    _getLayerFromDatasetId: function(datasetId) {
      var layerSlug = this.datasets[datasetId];

      var layer = this.status.get('layerSpec').getLayer({
        slug: layerSlug
      });

      return layer;
    },

    /**
     * Render the analysis from the supplied AnalysisService
     * results object.
     *
     * @param  {Object} results Results object form the AnalysisService
     */
    _renderAnalysis: function(results) {
      var layer = this._getLayerFromDatasetId(results.meta.id);

      // Unexpected results from successful request
      if (!layer) {
        this._renderResults({failure: true});
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
      p.alertsName = results.meta.name;

      if (results.params.iso) {
        p.iso = results.params.iso;
      }

      var dateRange = [moment(results.params.begin),
        moment(results.params.end)];

      p.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),
        dateRange[1].format('MMM-YYYY'));

      if (results.params.geojson) {
        p.totalArea = this._getHectares(results.params.geojson);
      } else if (results.params.iso) {
        p.totalArea = this.status.get('isoTotalArea') ? this.status.get('isoTotalArea') : 0;
      }

      if (layer.slug !== 'imazon') {
        p.totalAlerts = (results.value) ? Number(results.value).toLocaleString() : 0;
      }

      /**
       * Fires params
       *   - dateRange (get it from the results as string)
       */
      if (layer.slug === 'fires') {
        p.dateRange = _.isArray(results.period) ? results.period[0] : results.period;
      }

      /**
       * UMD Loss and gain params.
       *   - lossDateRange
       *   - lossAlerts
       *   - gainAlerts
       */
      if (layer.slug === 'umd_tree_loss_gain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year());
        p.lossAlerts = 0;
        p.gainAlerts = 0;
        p.threshold  = results.params.thresh || 10;

        // The api returns all the loss and gain alerts.
        if (results.years) {
          var years = _.range(dateRange[1].diff(dateRange[0], 'years')+1);
          _.each(years, function(i) {
            var year = _.findWhere(results.years, {year: dateRange[0].year() + i});
            if (!year) {return;}
            p.lossAlerts += year.loss;
            p.gainAlerts += year.gain;
          });
        }

        p.lossAlerts = (results.loss) ? results.loss.toLocaleString() : p.lossAlerts.toLocaleString();
        p.gainAlerts = (results.gain) ? results.gain.toLocaleString() : p.gainAlerts.toLocaleString();

      }

      /**
       * Imazon params
       *   - degrad
       *   - defor
       */
      if (layer.slug === 'imazon') {
        p.degrad = (results.value[0]) ? Number(results.value[0].value).toLocaleString() : 0;
        p.defor = (results.value[1]) ? Number(results.value[1].value).toLocaleString() : 0;
      }

      return p;
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
