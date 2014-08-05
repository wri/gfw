/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps',
  'services/CountryService'
], function(Class, _, Backbone, mps, countryService) {

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

      this.status = new (Backbone.Model.extend())({
        currentDate: null,
        baselayer: null,
        analysis: null, // analysis resource
        overlay: null, // google.maps.Polygon (user draw)
        polygon: null, // geojson (user polygons)
        multipolygon: null // geojson (countries and regions)
      });

      this._subscribe();
      mps.publish('Place/register', [this]);
    },

    _subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec);
        this._checkUnavailable();
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this._setBaselayer(place.layerSpec);
        this._setCurrentDate([place.params.begin, place.params.end]);
        this._drawFromUrl(place.params.iso, place.params.geojson);
      }, this));

      mps.subscribe('AnalysisTool/update-analysis', _.bind(function() {
        if (this.status.get('analysis')) {
          this._publishAnalysis(this.status.get('analysis'));
        }
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.deleteGeom();
      }, this));

      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        this._setCurrentDate(date);
      }, this));

      mps.subscribe('MapView/click-protected', _.bind(function(wdpaid) {
        this._publishAnalysis({wdpaid: wdpaid});
      }, this));
    },

    _setCurrentDate: function(date) {
      if (date[0] && date[1]) {
        this.status.set('currentDate', date);
      }
    },

    /**
     * Set current baselayer from any layer change.
     */
    _setBaselayer: function(layerSpec) {
      var baselayers = layerSpec.getBaselayers();

      var baselayer = baselayers[_.first(_.intersection(
        _.pluck(baselayers, 'slug'),
        _.keys(this.datasets)))];

      this.status.set('baselayer', baselayer);
      this.view.model.set('hidden', !!!baselayer);
    },

    _drawFromUrl: function(iso, geojson) {
      // Draw country/regions
      if (iso !== 'ALL') {
        countryService.execute(iso, _.bind(function(results) {
          this.view.drawTopojson(results.topojson);
          this._publishAnalysis({iso: iso});
        },this));
      // Draw user drawn polygon
      } else if (geojson) {
        this.status.set('polygon', geojson);
        this.view.drawPaths(this._geojsonToPath(geojson));
        this._publishAnalysis({geojson: JSON.stringify(geojson)});
      }
    },

    _checkUnavailable: function() {
      if (!this.status.get('baselayer') && this.status.get('analysis')) {
        mps.publish('AnalysisService/results', [{unavailable: true}]);
      }
    },

    /**
     * Publish an analysis from a resource.
     * Resources should be stringified.
     *
     * @param  {Object} resource geojson/iso/wdpaid
     */
    _publishAnalysis: function(resource) {
      var date = this.status.get('currentDate');
      resource.dataset = this.datasets[this.status.get('baselayer').slug];

      if (!resource.wdpaid) {
        resource.period = '{0},{1}'.format(date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'));
      } else {
        resource.wdpaid = resource.wdpaid.wdpaid;
      }

      this.status.set('analysis', resource);
      mps.publish('AnalysisService/get', [resource]);
    },

    onOverlayComplete: function(e) {
      e.overlay.type = e.type;
      e.overlay.setEditable(true);
      this.setOverlay(e.overlay);
    },

    setOverlay: function(overlay) {
      this.status.set('overlay', overlay);
    },

    setMultipolygon: function(multipolygon, geojson) {
      this.status.set('multipolygon', multipolygon);
      mps.publish('AnalysisTool/iso-drawn', [geojson.geometry]);
    },

    startDrawing: function() {
      mps.publish('AnalysisTool/start-drawing', []);
    },

    stopDrawing: function() {
      mps.publish('AnalysisTool/stop-drawing', []);
    },

    doneDrawing: function() {
      var overlay = this.status.get('overlay');
      var paths = this.status.get('overlay').getPath().getArray();
      var geojson = this._pathToGeojson(paths);
      this.status.set('polygon', geojson);
      this.view.setEditable(overlay, false);
      this._publishAnalysis({geojson: JSON.stringify(geojson)});
    },

    /**
     * Deletes the current geometry from the map. This is triggered
     * when the users cancel a drawing or when a analysis is removed.
     */
    deleteGeom: function() {
      this.view.deleteGeom({
        overlay: this.status.get('overlay'),
        multipolygon: this.status.get('multipolygon')
      });

      // Reset status
      this.status.set('analysis', null);
      this.status.set('overlay', null);
      this.status.set('polygon', null);
      this.status.set('multipolygon', null);
    },

    /**
     * Generates a GEOJSON form a path.
     *
     * @param  {Array} path Array of google.maps.LatLng objects
     * @return {string} A GeoJSON string representing the path
     */
    _pathToGeojson: function(path) {
      var coordinates = null;

      coordinates = _.map(path, function(latlng) {
        return [
          _.toNumber(latlng.lng().toFixed(4)),
          _.toNumber(latlng.lat().toFixed(4))];
      });

      // First and last coordinate should be the same
      coordinates.push(_.first(coordinates));

      return {
        'type': 'Polygon',
        'coordinates': [coordinates]
      };
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
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var analysis = this.status.get('analysis');
      if (!analysis) {return;}
      var p = {};

      p.iso = null;
      p.geojson = null;

      if (analysis.iso) {
        p.iso = analysis.iso;
      } else if (analysis.geojson) {
        p.geojson = encodeURIComponent(analysis.geojson);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});

