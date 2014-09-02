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
  'topojson',
  'services/CountryService',
  'services/RegionService'
], function(Class, _, Backbone, mps, topojson, countryService, regionService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      baselayer: null,
      analysis: null, // analysis resource
      currentDate: null,
      threshold: null,
      overlay: null, // google.maps.Polygon (user draw)
      polygon: null, // geojson (user polygons)
      multipolygon: null // geojson (countries and regions)
    }
  });

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
      this.status = new StatusModel();
      this._subscribe();
      mps.publish('Place/register', [this]);
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec.getBaselayers());
        this._checkUnavailable();
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        var p = place.params;
        this._setBaselayer(place.layerSpec.getBaselayers());
        this._setCurrentDate([p.begin, p.end]);
        this.status.set('threshold', p.threshold);
        this._drawFromUrl(p.iso, p.geojson);
      }, this));

      mps.subscribe('AnalysisTool/update-analysis', _.bind(function() {
        this._updateAnalysis();
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this._deleteAnalysis();
      }, this));

      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        this._setCurrentDate(date);
      }, this));

      mps.subscribe('Threshold/changed', _.bind(function(threshold) {
        this.status.set('threshold', threshold);
      }, this));

      mps.subscribe('MapView/click-protected', _.bind(function(wdpaid) {
        this._getProtectedAreaPolygon(wdpaid.wdpaid);
        this._publishAnalysis({wdpaid: wdpaid});
      }, this));
    },

    _updateAnalysis: function() {
      if (this.status.get('analysis')) {
        this._publishAnalysis(this.status.get('analysis'));
      }
    },

    _deleteAnalysis: function() {
      if (this.status.get('analysis')) {
        this.deleteGeom();
      }
    },

    _setCurrentDate: function(date) {
      if (date[0] && date[1]) {
        this.status.set('currentDate', date);
      }
    },

    /**
     * Set the status.baselayer from layerSpec.
     *
     * @param {Object} baselayers Current active baselayers
     */
    _setBaselayer: function(baselayers) {
      var baselayer = baselayers[_.first(_.intersection(
        _.pluck(baselayers, 'slug'),
        _.keys(this.datasets)))];

      this.status.set('baselayer', baselayer);
      this.view.model.set('hidden', !!!baselayer);
    },

    _getProtectedAreaPolygon: function(id) {
      var self = this;
       $.getJSON('http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_all where wdpaid ='+id, function(data) {
          self._drawFromUrl('wdpa', JSON.parse(data.rows[0].st_asgeojson));
        });
    },

    _drawFromUrl: function(iso, geojson) {
      var resource = null;

      // Draw country
      if (iso.country && iso.country !== 'ALL' && !iso.region) {
        resource = {iso: iso.country};
        countryService.execute(iso.country, _.bind(function(results) {
          var geojson = topojson.feature(results.topojson, results.topojson.objects[0]);
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);
        },this));
      // Draw region
      } else if (iso.country !== 'ALL' && iso.region) {
        resource = {iso: iso.country, id1: iso.region};
        regionService.execute(resource, _.bind(function(results) {
          var geojson = results.features[0];
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);
        },this));
      } else if (iso === 'wdpa') {
        this.view.drawMultipolygon({
          geometry: geojson,
          properties: {},
          type: 'Feature'
        });
        // TODO => these fit bounds should publish 'map/fitbounds'
        this.view._fitBounds(geojson.coordinates[0][0]);
      // Draw user polygon
      } else if (geojson) {
        resource = {geojson: JSON.stringify(geojson)};
        this.status.set('polygon', geojson);
        this.view.drawPaths(this._geojsonToPath(geojson));
        this._publishAnalysis(resource);
      }
      // Append resource to analysis before the analysis resource is
      // created, this way the url doesnt blink until the topojsons
      // are loaded. We can find another way of doing this on the PlaceService.
      this.status.set('analysis', resource);
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
      // If there are no baselayer render unsupported layer msg.
      if (!this.status.get('baselayer')) {
        mps.publish('AnalysisResults/unavailable', []);
        return;
      }

      if (this.status.get('baselayer').slug === 'umd_tree_loss_gain') {
        resource.thresh = '?thresh=' + this.status.get('threshold');
      } else {
        delete resource.thresh;
      }

      var date = this.status.get('currentDate');
      resource.dataset = this.datasets[this.status.get('baselayer').slug];

      if (!resource.wdpaid && !resource.iso) {
        this.view._fitBounds(JSON.parse(resource.geojson).coordinates[0]);
      }

      if (!resource.wdpaid) {
        resource.period = '{0},{1}'.format(date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'));
      } else if (resource.wdpaid) {
        resource.wdpaid = resource.wdpaid.wdpaid;
      }

      this.status.set('analysis', resource);
      mps.publish('Place/update', [{go: false}]);
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

      if (analysis.iso) {
        p.iso = {};
        p.iso.country = analysis.iso;
        p.iso.region = analysis.id1 ? analysis.id1 : null;
      } else if (analysis.geojson) {
        p.geojson = encodeURIComponent(analysis.geojson);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
