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
  'd3',
  'topojson',
  'helpers/geojsonUtilsHelper',
  'map/services/CountryService',
  'map/services/RegionService'
], function(Class, _, Backbone, mps, d3, topojson, geojsonUtilsHelper, countryService, regionService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      baselayer: null,
      resource: null, // analysis resource
      date: null,
      threshold: null,
      overlay: null, // google.maps.Polygon (user drawn polygon)
      multipolygon: null, // geojson (countries and regions multypolygon)
      disableUpdating: false
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
      mps.subscribe('Place/go', _.bind(function(place) {
        var p = place.params;
        // Set status
        this._setBaselayer(place.layerSpec.getBaselayers());
        this.status.set('date', [p.begin, p.end])
        this.status.set('threshold', p.threshold);

        this._handlePlaceGo(_.pick(
          place.params, 'iso', 'geojson', 'analyze'));
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec.getBaselayers());
        this._checkUnavailable();
        this._updateAnalysis();
      }, this));

      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        this.status.set('date', date)
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

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.deleteAnalysis();
      }, this));

      mps.subscribe('AnalysisTool/update-analysis', _.bind(function() {
        this._updateAnalysis();
      }, this));

      mps.subscribe('Threshold/changed', _.bind(function(threshold) {
        this.status.set('threshold', threshold);
      }, this));

      mps.subscribe('AnalysisTool/analyze-wdpaid', _.bind(function(wdpaid) {
        this._analyzeWdpai(wdpaid.wdpaid);
      }, this));
    },

    /**
     * Handles a Place/go.
     *
     * @param  {Object} params Place params (iso, geojson)
     */
    _handlePlaceGo: function(params) {
      if (params.analyze) {
        this.view.onClickAnalysis();
      } else if (params.iso.country && params.iso.country !== 'ALL') {
        this._analyzeIso(params.iso);
      } else if (params.geojson) {
        this._analyzeGeojson(params.geojson)
      }
    },

    /**
     * Analyzes a geojson object.
     *
     * @param  {[type]} geojson [description]
     */
    _analyzeGeojson: function(geojson, options) {
      options = options || {draw: true};

      // Build resource
      var resource = this._buildResource({
        geojson: JSON.stringify(geojson)
      });

      // Draw geojson if needed
      if (options.draw) {
        this.view.drawPaths(
          geojsonUtilsHelper.geojsonToPath(geojson));
      }

      // Publish analysis
      this._publishAnalysis(resource);
    },

    /**
     * Analyze country/region by iso.
     *
     * @param  {Object} iso {country: {string}, id: {integer}}
     */
    _analyzeIso: function(iso) {
      // Build resource
      var resource = {iso: iso.country};
      if (iso.region) {
        resource.id1 = iso.region;
      }
      resource = this._buildResource(resource);

      if (!iso.region) {
        // Get geojson/fit bounds/draw geojson/publish analysis.
        countryService.execute(resource.iso, _.bind(function(results) {
          var geojson = topojson.feature(results.topojson,
            results.topojson.objects[0]);

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);
        },this));
      } else {
        regionService.execute(resource, _.bind(function(results) {
          var geojson = results.features[0];

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);
        },this));
      }
    },

    _analyzeWdpai: function(wpaid) {
      // Build resource
      var resource = this._buildResource({
        wdpaid: wpaid
      });

      // Get geojson/fit bounds/draw geojson/publish analysis
      var url = 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_all where wdpaid =' + wpaid;
      $.getJSON(url, _.bind(function(data) {
        var geojson = {
          geometry: JSON.parse(data.rows[0].st_asgeojson),
          properties: {},
          type: 'Feature'
        };

        this._geojsonFitBounds(geojson);
        this.view.drawMultipolygon(geojson);
        this._publishAnalysis(resource);
      }, this));
    },

    /**
     * Get the geojson from the current and analyze
     * that geojson without drawing again the geom.
     */
    doneDrawing: function() {
      var overlay = this.status.get('overlay');
      var paths = overlay.getPath().getArray();
      var geojson = geojsonUtilsHelper.pathToGeojson(paths);

      // this.status.set('polygon', geojson);
      // set editable to false

      this.view.setEditable(overlay, false);
      this._analyzeGeojson(geojson, {draw: false});
    },

    /**
     * Build a resource, adding extra options
     * from the current status.
     */
    _buildResource: function(resource) {
      var date, dateFormat;
      var baselayer = this.status.get('baselayer');

      // Append dataset string
      resource.dataset = this.datasets[baselayer.slug];

      // Append period
      date = this.status.get('date');
      dateFormat = 'YYYY-MM-DD';

      // period format = 2012-12-23,2013-01-4
      resource.period = '{0},{1}'.format(
        date[0].format(dateFormat), date[1].format(dateFormat));

      // this is super ugly
      if (baselayer.slug === 'umd_tree_loss_gain') {
        resource.thresh = '?thresh=' + this.status.get('threshold');
      } else {
        delete resource.thresh;
      }

      return resource;
    },

    /**
     * Publish an analysis form a suplied resource.
     *
     * @param  {Object} resource The analysis resource
     */
    _publishAnalysis: function(resource) {
      this.status.set('resource', resource);
      mps.publish('Place/update', [{go: false}]);
      mps.publish('AnalysisService/get', [resource]);
    },

    /**
     * Updates current analysis if it's permitted.
     */
    _updateAnalysis: function() {
      var resource = this.status.get('resource');

      if (resource && !this.status.get('disableUpdating') && this.status.get('baselayer')) {
        resource = this._buildResource(resource);
        this._publishAnalysis(resource);
      }
    },

    /**
     * Deletes the current analysis.
     */
    deleteAnalysis: function() {
      // Delete overlay drawn or multipolygon.
      this.view.deleteGeom({
        overlay: this.status.get('overlay'),
        multipolygon: this.status.get('multipolygon')
      });

      // Reset status model
      this.status.set({
        resource: null,
        overlay: null,
        polygon: null,
        multipolygon: null
      });

      mps.publish('AnalysisTool/analysis-deleted', []);
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
      this.view.$widgetBtn.toggleClass('disabled', !!!baselayer);
    },

    _checkUnavailable: function() {
      if (!this.status.get('baselayer') && this.status.get('resource')) {
        mps.publish('AnalysisService/results', [{unavailable: true}]);
      }
    },

    /**
     * Publish a 'Map/fit-bounds' with the bounds
     * from the suplied geojson.
     *
     * @param  {Object} geojson
     */
    _geojsonFitBounds: function(geojson) {
      var bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
      mps.publish('Map/fit-bounds', [bounds]);
    },

    /**
     * Publish a start drawing mps event.
     */
    startDrawing: function() {
      mps.publish('AnalysisTool/start-drawing', []);
    },

    /**
     * Publish a stop drawing mps event.
     */
    stopDrawing: function() {
      mps.publish('AnalysisTool/stop-drawing', []);
    },

    /**
     * Triggered when user finish drawing a polygon.
     * @param  {Object} e Event
     */
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

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var resource = this.status.get('resource');
      if (!resource) {return;}
      var p = {};

      if (resource.iso) {
        p.iso = {};
        p.iso.country = resource.iso;
        p.iso.region = resource.id1 ? resource.id1 : null;
      } else if (resource.geojson) {
        p.geojson = encodeURIComponent(resource.geojson);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
