/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore',
  'backbone',
  'mps',
  'topojson',
  'helpers/geojsonUtilsHelper',
  'map/services/CountryService',
  'map/services/RegionService'
], function(PresenterClass, _, Backbone, mps, topojson, geojsonUtilsHelper, countryService, regionService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      baselayer: null,
      both: false,
      resource: null, // analysis resource
      date: null,
      threshold: 30, // by default
      iso: null,
      overlay: null, // google.maps.Polygon (user drawn polygon)
      multipolygon: null, // geojson (countries and regions multypolygon)
      disableUpdating: false
    }
  });

  var concessionsSql = {
    'logging': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from logging_gcs_wgs84 where cartodb_id ={0}',
    'mining':'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from mining_permits_merge where cartodb_id ={0}',
    'oilpalm': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from oil_palm_permits_merge where cartodb_id ={0}',
    'fiber': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from fiber_all_merged where cartodb_id ={0}'
  };

  var AnalysisToolPresenter = PresenterClass.extend({

    datasets: {
      'loss': 'umd-loss-gain',
      'forestgain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts',
      'terrailoss': 'terrai-alerts'
    },

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this._setBaselayer(place.layerSpec.getBaselayers());
        this.status.set('date', [place.params.begin, place.params.end]);
        this.status.set('threshold', place.params.threshold);
        this._handlePlaceGo(place.params);
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this._setBaselayer(layerSpec.getBaselayers());
        this._updateAnalysis();
      }
    }, {
      'AnalysisTool/update-analysis': function() {
        this._updateAnalysis();
      }
    }, {
      'AnalysisResults/delete-analysis': function() {
        this.deleteAnalysis();
      }
    }, {
      'AnalysisTool/analyze-wdpaid': function(wdpaid) {
        this.view._stopDrawing();
        this.deleteAnalysis();
        this._analyzeWdpai(wdpaid.wdpaid);
      }
    }, {
      'AnalysisTool/analyze-concession': function(useid, layerSlug, wdpaid) {
        if (wdpaid && wdpaid != "") {
          wdpaid = {wdpaid : wdpaid}
          mps.publish('AnalysisTool/analyze-wdpaid', [wdpaid]);
         return;
        }
        this.view._stopDrawing();
        this.deleteAnalysis();
        this._analyzeConcession(useid, layerSlug);
      }
    }, {
      'Timeline/date-change': function(layerSlug, date) {
        this.status.set('date', date);
        this._updateAnalysis();
      }
    }, {
      'Timeline/start-playing': function() {
        this.status.set('disableUpdating', true);
      }
    }, {
      'Timeline/stop-playing': function() {
        this.status.set('disableUpdating', false);
        this._updateAnalysis();
      }
    }, {
      'Threshold/changed': function(threshold) {
        this.status.set('threshold', threshold);
        this._updateAnalysis();
      }
    },{
      'Tab/opened': function(id) {
        if (id === 'analysis-tab') {
          this.view.model.set('hidden',false);
        }else{
          if (this.view.model.get('is_drawing')) {
            this.view._stopDrawing();
            this.deleteAnalysis();
            this.view.model.set('hidden',true);
          }
        }
      },
    },{
      'LocalMode/changeIso': function(iso) {
        this._analyzeIso(iso)
      }
    }],
    /**
     * Handles a Place/go.
     *
     * @param  {Object} params Place params
     */
    _handlePlaceGo: function(params) {
      if (params.analyze && params.name === 'map') {
        this.view.onClickAnalysis();
      } else if (params.iso.country && params.iso.country !== 'ALL') {
        this._analyzeIso(params.iso);
      } else if (params.geojson) {
        this._analyzeGeojson(params.geojson);
      } else if (params.wdpaid) {
        this._analyzeWdpai(params.wdpaid);
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
      var resource = {
        geojson: JSON.stringify(geojson),
        type: 'geojson'
      };
      resource = this._buildResource(resource);


      // Draw geojson if needed.
      if (options.draw) {
        this.view.drawPaths(
          geojsonUtilsHelper.geojsonToPath(geojson));
      }

      // Publish analysis
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', Polygon: true');
      this._publishAnalysis(resource);
    },

    /**
     * Analyze country/region by iso.
     *
     * @param  {Object} iso {country: {string}, id: {integer}}
     */
    _analyzeIso: function(iso) {
      this.deleteAnalysis();
      this.view.setSelects(iso);
      mps.publish('LocalMode/updateIso', [iso]);

      // Build resource
      var resource = {
        iso: iso.country,
        type: 'iso'
      };
      if (iso.region) {
        resource.id1 = iso.region;
      }
      resource = this._buildResource(resource);
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', Iso: ' + resource.iso.country);

      if (!iso.region) {
        // Get geojson/fit bounds/draw geojson/publish analysis.
        countryService.execute(resource.iso, _.bind(function(results) {
          var objects = _.findWhere(results.topojson.objects, {
            type: 'MultiPolygon'
          });

          var geojson = topojson.feature(results.topojson,
            objects);

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

    _analyzeWdpai: function(wdpaid) {
      // Build resource
      var resource = this._buildResource({
        wdpaid: wdpaid,
        type: 'other'
      });

      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', Wdpaid: ' + resource.wdpaid);
      // Get geojson/fit bounds/draw geojson/publish analysis
      var url = 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_all where wdpaid =' + wdpaid;
      $.getJSON(url, _.bind(function(data) {
        if (data.rows.length > 0) {
          var geojson = {
            geometry: JSON.parse(data.rows[0].st_asgeojson),
            properties: {},
            type: 'Feature'
          };

          mps.publish('AnalysisResults/totalArea', [{hectares: geojsonUtilsHelper.getHectares(geojson.geometry)}]);

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);

        } else {
          this._publishAnalysis(resource, true);
        }
      }, this));
    },

    /**
     * Analyze a concession.
     *
     * @param  {integer} useid Carto db id
     */
    _analyzeConcession: function(useid, layerSlug) {
      var resource = this._buildResource({
        useid: useid,
        use: layerSlug,
        type: 'other'
      });

      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', ConcessionLayer: ' + resource.use + ', ConcessionId: ' + resource.useid);

      var url = concessionsSql[layerSlug].format(useid);

      $.getJSON(url, _.bind(function(data) {
        if (data.rows.length > 0) {
          var geojson = {
            geometry: JSON.parse(data.rows[0].st_asgeojson),
            properties: {},
            type: 'Feature'
          };

          mps.publish('AnalysisResults/totalArea', [{hectares: geojsonUtilsHelper.getHectares(geojson.geometry)}]);

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          this._publishAnalysis(resource);

        } else {
          this._publishAnalysis(resource, true);
        }
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

      this.view.setEditable(overlay, false);
      this._analyzeGeojson(geojson, {draw: false});
    },

    /**
     * Build a resource, adding extra options
     * from the current status.
     */
    _buildResource: function(resource) {
      mps.publish('Spinner/start');
      var date, dateFormat;
      var baselayer = this.status.get('baselayer');

      // Return resource if there isn't a baselayer
      // so we can build the resource later
      // and display a 'unsupported layer' message.
      if (!baselayer) {
        return resource;
      }

      if (baselayer.slug !== 'forestgain') {
        // Append dataset string
        resource.dataset = this.datasets[baselayer.slug];

        // Append period
        date = this.status.get('date');
        dateFormat = 'YYYY-MM-DD';

        // period format = 2012-12-23,2013-01-4
        date[0] = (date[0] != null) ? date[0] : '2001-01-01';
        date[1] = (date[1] != null) ? date[1] : '2013-12-31';
        resource.period = '{0},{1}'.format(
          date[0].format(dateFormat), date[1].format(dateFormat));

        // this is super ugly
        if (baselayer.slug === 'loss') {
          resource.thresh = '?thresh=' + ((this.status.get('threshold') === null) ? 30 :  this.status.get('threshold'));
        } else {
          delete resource.thresh;
        }

        return resource;
      }else{
        // Append dataset string
        resource.dataset = this.datasets[baselayer.slug];

        // Append period
        date = ['2001-01-01','2013-12-31'];

        // period format = 2012-12-23,2013-01-4
        resource.period = '{0},{1}'.format(
          date[0], date[1]);

        // this is super ugly
        resource.thresh = '?thresh=' + this.status.get('threshold');

        return resource;

      }
    },

    /**
     * Publish an analysis form a suplied resource.
     *
     * @param  {Object} resource The analysis resource
     */
    _publishAnalysis: function(resource, failed) {
      this.status.set('resource', resource);
      // this._setAnalysisBtnVisibility();
      mps.publish('Place/update', [{go: false}]);
      //Open tab of analysis
      mps.publish('Tab/open', ['#analysis-tab-button']);
      this.view.openTab(resource.type);


      if (!this.status.get('baselayer') || failed) {
        mps.publish('AnalysisService/results', [{unavailable: true}]);
      } else {
        mps.publish('AnalysisService/get', [resource]);
      }
    },

    /**
     * Updates current analysis if it's permitted.
     */
    _updateAnalysis: function() {
      var resource = this.status.get('resource');

      if (resource && !this.status.get('disableUpdating')) {
        resource = this._buildResource(resource);
        this._publishAnalysis(resource);
      }
    },

    /**
     * Deletes the current analysis.
     */
    deleteAnalysis: function() {
      this.view.$el.removeClass('is-analysis');
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

      this._setAnalysisBtnVisibility();
    },

    /**
     * Set the status.baselayer from layerSpec.
     *
     * @param {Object} baselayers Current active baselayers
     */
    _setBaselayer: function(baselayers) {
      var baselayer;

      if (baselayers['loss']) {
        baselayer = baselayers['loss'];
        this.status.set('both', (baselayers['forestgain']) ? true : false);
      }else{
        baselayer = baselayers[_.first(_.intersection(
          _.pluck(baselayers, 'slug'),
          _.keys(this.datasets)))];
      }

      this.status.set('baselayer', baselayer);
      this._setAnalysisBtnVisibility();
    },

    _setAnalysisBtnVisibility: function() {
      this.view.toggleBtn(!!!this.status.get('baselayer'));
    },

    /**
     * Publish a 'Map/fit-bounds' with the bounds
     * from the suplied geojson.
     *
     * @param  {Object} geojson
     */
    _geojsonFitBounds: function(geojson) {
      var bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
      if (bounds) {
        mps.publish('Map/fit-bounds', [bounds]);
      }
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
      } else if (resource.wdpaid) {
        p.wdpaid = resource.wdpaid;
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
