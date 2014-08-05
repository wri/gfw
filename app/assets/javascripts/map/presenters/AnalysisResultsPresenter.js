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
        this.status.set('analysis', true);
      }, this));

      mps.subscribe('AnalysisTool/iso-drawn', _.bind(function(multipolygon) {
        this.status.set('isoTotalArea', this._getHectares(multipolygon));
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
        this.view.renderFailure();
        return;
      }

      var dateRange = [moment(results.params.begin), moment(results.params.end)];
      var p = {};

      p[layerSlug] = true;
      p.layer = layer;
      p.download = results.download_urls;

      if (results.params.geojson) {
        p.totalArea = this._getHectares(results.params.geojson);
      } else if (results.params.iso) {
        p.totalArea = this.status.get('isoTotalArea') ? this.status.get('isoTotalArea') : 0;
      }

      if (layer.slug === 'umd_tree_loss_gain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year());
        p.lossAlerts = 0;
        p.gainAlerts = 0;

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
