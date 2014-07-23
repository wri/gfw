/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/CountryService'
], function(Class, _, mps, countryService) {

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
      this.currentAnalysis = null;
      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this._setBaselayer(place.params.layerSpec);

        if (place.params.iso !== 'ALL') {
          this._drawIso(place.params.iso);
        } else if (place.params.geom) {
          this._drawGeom(place.params.geom);
        }
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.view.deleteSelection();
        this.currentAnalysis = null;
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Set current baselayer from any layer change.
     */
    _setBaselayer: function(layerSpec) {
      this.baselayer = _.first(_.intersection(
        _.pluck(layerSpec.getBaselayers(), 'slug'),
        _.keys(this.datasets)));

      this._setVisibility();
    },

    /**
     * Toggle hidden depending on active layers.
     */
    _setVisibility: function() {
      if (!this.baselayer) {
        this._deleteAnalysis();
        this.view.model.set('hidden', true);
      } else {
        this.view.model.set('hidden', false);
      }
    },

    /**
     * Used by this presenter to delete analysis when the
     * current baselayer doesn't support analysis.
     */
    _deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
      this.view._onClickCancel();
    },

    /**
     * Draw geom on the map and publish analysis of that geom.
     *
     * @param  {object} geom
     */
    _drawGeom: function(geom) {
      this.view.drawGeom(geom);
      this.publishAnalysis({geom: geom});
    },

    /**
     * Used by this presenter to draw a country and publish an analysis of that.
     *
     * @param  {string} iso Country iso
     */
    _drawIso: function(iso) {
      countryService.execute(iso, _.bind(function(results) {
        this.view.drawIso(results.topojson);
        // mps.publish('Map/fit-bounds', [bounds]);
        this.publishAnalysis({iso: iso});
      },this));
    },

    /**
     * Publish an analysis and set the currentResource.
     */
    publishAnalysis: function(resource) {
      var data = {};

      data.dataset = this.datasets[this.baselayer];

      if (resource.geom) {
        data.geojson = resource.geom;
      } else if (resource.iso) {
        data.iso = resource.iso;
      }

      this.currentAnalysis = resource;
      mps.publish('AnalysisService/get', [data]);
    },

    /**
     * Generates a GEOJSON form a path.
     *
     * @param  {object} path
     * @return {object} geojson
     */
    createGeoJson: function(path) {
      var coordinates = null;

      coordinates = _.map(path, function(latlng) {
        return [[
          _.toNumber(latlng.lng().toFixed(4)),
          _.toNumber(latlng.lat().toFixed(4))]];
      });

      // First and last coordinate should be the same
      coordinates = _.union(coordinates, _.first(coordinates));

      return JSON.stringify({
        'type': 'Polygon',
        'coordinates': coordinates
      });
    },

    /**
     * Convert a geojson into a path.
     *
     * @param  {object} geojson
     * @return {array} paths
     */
    geomToPath: function(geom) {
      var coords = JSON.parse(geom).coordinates;

      return _.map(coords, function(g) {
        g = _.flatten(g);
        return new google.maps.LatLng(g[1], g[0]);
      });
    },

    startDrawing: function() {
      mps.publish('AnalysisTool/start-drawing', []);
    },

    stopDrawing: function() {
      mps.publish('AnalysisTool/stop-drawing', []);
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      if (!this.currentAnalysis) {return;}
      var p = {};

      if (this.currentAnalysis.iso) {
        p.iso = this.currentAnalysis.iso;
      } else if (this.currentAnalysis.geom) {
        p.geom = encodeURIComponent(this.currentAnalysis.geom);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
