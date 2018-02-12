/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 'backbone', 'mps', 'topojson', 'bluebird', 'moment',
  'helpers/geojsonUtilsHelper',
  'map/helpers/FiresDatesHelper',
  'map/services/CountryService',
  'map/services/RegionService',
  'map/services/GeostoreService',
  'helpers/datasetsHelper'
], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment,
  geojsonUtilsHelper, FiresDatesHelper, countryService, regionService,
  GeostoreService, datasetsHelper) {

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
      disableUpdating: false,
      dont_analyze: false,
    }
  });

  var concessionsSql = {
    'logging': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_logging where cartodb_id ={0}',
    'mining':'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_mining where cartodb_id ={0}',
    'oilpalm': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_oil_palm where cartodb_id ={0}',
    'fiber': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_wood_fiber where cartodb_id ={0}'
  };

  var AnalysisToolPresenter = PresenterClass.extend({

    datasets: {
      'loss': 'umd-loss-gain',
      'forestgain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'terrailoss': 'terrai-alerts',
      'prodes': 'prodes-loss',
      'guyra': 'guira-loss',
      'forest2000': 'umd-loss-gain',
      'viirs_fires_alerts': 'viirs-active-fires',
      'umd_as_it_happens':'glad-alerts',
      'umd_as_it_happens_per':'glad-alerts',
      'umd_as_it_happens_cog':'glad-alerts',
      'umd_as_it_happens_idn':'glad-alerts',
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
      'Analysis/drawGeojson': function(geostore) {
        this.status.set('geostore', geostore.id);
        this._handlePlaceGo({geojson: geostore.attributes});
      }
    }, {
      'Place/go': function(place) {
        this._setBaselayer(place.layerSpec.getBaselayers());
        if (! !!this.status.get('date')) {
          this.status.set('date', [place.params.begin, place.params.end]);
        }
        this.status.set('threshold', place.params.threshold);
        this.status.set('dont_analyze', place.params.dont_analyze);
        this.status.set('layerOptions', place.params.layer_options);
        this._handlePlaceGo(place.params);
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        var baselayer = this.status.get('baselayer');
        var both = this.status.get('both');
        var loss_gain_and_extent = this.status.get('loss_gain_and_extent');
        this._setBaselayer(layerSpec.getBaselayers());
        this.status.set('loss_gain_and_extent', layerSpec.checkLossGainExtent());

        this.view.toggleCountrySubscribeBtn();
        this.view.toggleDoneSubscribeBtn();

        if (this.status.get('baselayer') != baselayer) {
          this._updateAnalysis();
          this.openAnalysisTab();
        }else{
          if (this.status.get('both') != both) {
            this._updateAnalysis();
            this.openAnalysisTab();
          }
        }

        if (loss_gain_and_extent != this.status.get('loss_gain_and_extent')) {
          this._updateAnalysis();
          this.openAnalysisTab();
        }
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
      'AnalysisService/refresh': function() {
        mps.publish('Spinner/start');
      }
    }, {
      'AnalysisTool/analyze-wdpaid': function(wdpaid) {
        this.openAnalysisTab(true);
        this._analyzeWdpai(wdpaid.wdpaid, { analyze: true, fit_bounds: true });
      }
    }, {
      'Subscription/analyze-concession': function(useid, layerSlug, wdpaid) {
        var subscribe = function(resource) {
          this.status.set('resource', resource);
          mps.publish('Place/update', [{go: false}]);
          this._subscribeAnalysis();
        }.bind(this);

        if (wdpaid && wdpaid != "") {
          this._analyzeWdpai(wdpaid, {analyze: false}).then(subscribe);
        } else {
          this._analyzeConcession(useid, layerSlug, {analyze: false}).then(subscribe);
        }
      }
    }, {
      'AnalysisTool/analyze-concession': function(useid, layerSlug, wdpaid) {
        if (wdpaid && wdpaid != "") {
          wdpaid = {wdpaid : wdpaid}
          mps.publish('AnalysisTool/analyze-wdpaid', [wdpaid]);
          return;
        }
        this.openAnalysisTab(true);
        this._analyzeConcession(useid, layerSlug);
      }
    },{
      'Analysis/dont_analyze': function(enabled) {
        this.status.set('dont_analyze', enabled);
      }
    },{
      'Analysis/iso': function(iso) {
        this.status.set('dont_analyze', false);
        this._analyzeIso(iso);
      }
    },{
      'Analysis/enabled': function(boolean) {
        this.view.toggleAnalysis(boolean);
      }
    },{
      'Analysis/toggle': function(boolean) {
        this.view.toggleAnalysis($('#analysis-tab').hasClass('is-analysis'));
      }
    },{
      'Analysis/upload': function(geojson) {
        this._saveAndAnalyzeGeojson(geojson, {draw: true});
        ga('send', 'event', 'Map', 'Analysis', 'Upload Shapefile');
      }
    },
    // Timeline
    {
      'Timeline/date-change': function(layerSlug, date) {
        this.status.set('date', date);
        this.openAnalysisTab();
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
      'Threshold/update': function(threshold) {
        this.status.set('threshold', threshold);
        this.openAnalysisTab();
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
      'Country/update': function(iso) {
        if (!!iso.country) {
          this.deleteAnalysis();
          this.view.setSelects(iso, true);
        } else {
          this.deleteAnalysis();
        }
      }
    },{
      'Subscribe/cancel' : function(){
        this.status.set('subscribe_only', false);
      }
    }, {
      'Subscribe/end' : function(){
        this.view.setStyle();
        if (this.status.get('subscribe_only') === true) {
          this.status.set('subscribe_only', false);
          this.deleteAnalysis();
          mps.publish('Place/update', [{go: false}]);
          this.view.toggleAnalysis(true);
          this.view._stopDrawing();
        }
      }
    },{
      'Subscribe/iso': function(iso) {
        this.status.set('dont_analyze', false);
        this._subscribeIso(iso)
      }
    },{
      'Dialogs/close': function() {
        this.view.toggleAnalysis(true);
      }
    }, {
      'Spinner/cancel': function() {
        mps.publish('AnalysisService/cancel', []);
        mps.publish('AnalysisResults/delete-analysis', []);
        mps.publish('Place/update', [{go: false}]);
      }
    }, {
      'Infowindow/toggleSubscribeButton': function() {
        var baselayer = this.status.get('baselayer');
        var subscriptionsAllowed = datasetsHelper.getListSubscriptionsAllowed();
        if (baselayer && subscriptionsAllowed.indexOf(baselayer.slug) > -1) {
          $('#subscriptionBtn').removeClass('disabled');
        } else {
          $('#subscriptionBtn').addClass('disabled');
        }
      }
    }, {
      'LayerNav/changeLayerOptions': function(layerOptions) {
        this.status.set('layerOptions', layerOptions || []);
        this._updateAnalysis();
      }
    }],

    openAnalysisTab: function(open){
      var open = open || this.view.$el.hasClass('is-analysis');
      if (open) {
        mps.publish('Tab/open', ['#analysis-tab-button']);
      }
    },

    /**
     * Handles a Place/go.
     *
     * @param  {Object} params Place params
     */
    _handlePlaceGo: function(params) {
      if (params.tab && params.tab !== 'analysis-tab') { return; }

      var subscribe = function() {
        if (params.subscribe) {
          this._subscribeAnalysis();
        }
      }.bind(this);

      if (params.fit_to_geom !== undefined) {
        this.status.set('fit_to_geom', params.fit_to_geom)
      }

      var fit_to_geom = this.status.get('fit_to_geom') === 'true';
      if (params.analyze && params.name === 'map') {
        this.view.onClickAnalysis();
      } else if (params.wdpaid) {
        this._analyzeWdpai(params.wdpaid).then(subscribe);
      } else if (params.use && params.useid) {
        this._analyzeConcession(params.useid, params.use).then(subscribe);
      } else if (params.iso && params.iso.country && params.iso.country !== 'ALL') {
        if (params.geojson) {
          Promise.all([
            this._analyzeIso(params.iso),
            this._analyzeGeojson(params.geojson, {draw: true, fit_to_geom: fit_to_geom})
          ]).then(subscribe);
        } else {
          this._analyzeIso(params.iso).then(subscribe);
        }
      } else if (params.geojson) {
        this._analyzeGeojson(params.geojson, {draw: true, fit_to_geom: fit_to_geom}).then(subscribe);
      } else if (params.geostore) {
        this.status.set('geostore', params.geostore);
        subscribe();
      }
    },

    _subscribeAnalysis: function() {
      var options = {
        geostore: this.status.get('geostore'),
        analysisResource: this.status.get('resource'),
        layer: this.status.get('baselayer')
      };

      mps.publish('Subscribe/show', [options]);
    },

    /**
     * Analyzes a geojson object.
     *
     * @param  {[type]} geojson [description]
     */
    _analyzeGeojson: function(geojson, options) {
      return new Promise(function(resolve) {

      options = options || {draw: true};

      // Build resource
      var resource = {
        type: 'geojson'
      };
      mps.publish('Spinner/start');
      resource = this._buildResource(resource);

      var paths = geojsonUtilsHelper.geojsonToPath(geojson);
      // Draw geojson if needed.
      if (options.draw) {
        this.view.drawPaths(paths);
      }

      if (options.fit_to_geom) {
        var bounds = new google.maps.LatLngBounds();
        paths.forEach(function(point) {
          bounds.extend(point);
        });
        this.view.map.fitBounds(bounds);
      }

      // Publish analysis
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', Polygon: true');
      this._publishAnalysis(resource);
      resolve();

      }.bind(this));
    },

    _saveAndAnalyzeGeojson: function(geojson, options) {
      mps.publish('Spinner/start');
      GeostoreService.save(geojson).then(function(geostoreId) {
        this.status.set('geostore', geostoreId);
        this._analyzeGeojson(geojson, options);
      }.bind(this));
    },

    /**
     * Analyze country/region by iso.
     *
     * @param  {Object} iso {country: {string}, id: {integer}}
     */
    _analyzeIso: function(iso, options) {
      return new Promise(function(resolve) {

      var baselayer = this.getBaselayer();
      var options = options || {};
      this.deleteAnalysis();
      this.view.setSelects(iso, this.status.get('dont_analyze'));
      mps.publish('Country/update', [iso]);
      this.status.unset('geostore');

      // Build resource
      var resource = {
        iso: iso.country,
        type: 'iso'
      };
      if (iso.region) {
        resource.id1 = iso.region;
      }
      mps.publish('Spinner/start');
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
          mps.publish('Subscribe/geom',[geojson]);

          if (!this.status.get('dont_analyze')) {
            if (baselayer) {
              this.view.drawCountrypolygon(geojson,'#A2BC28');
              this.view._removeCartodblayer();
              this._publishAnalysis(resource);
              resolve(resource);
            } else {
              mps.publish('Spinner/stop');
            }
          } else {
            mps.publish('Spinner/stop');
          }
        },this));
      } else {
        regionService.execute(resource, _.bind(function(results) {
          var geojson = results.features[0];
          this._geojsonFitBounds(geojson);
          mps.publish('Subscribe/geom',[geojson]);

          if (!this.status.get('dont_analyze')) {
            if (baselayer) {
              this.view.drawCountrypolygon(geojson,'#A2BC28');
              this.view._removeCartodblayer();
              this._publishAnalysis(resource);
              resolve(resource);
            } else {
              mps.publish('Spinner/stop');
            }
          } else {
            mps.publish('Spinner/stop');
          }

        },this));
      }

      }.bind(this));
    },

    _subscribeIso: function(iso) {
      var baselayer = this.getBaselayer();
      this.status.unset('geostore');

      var resource = { iso: iso.country, type: 'iso' };
      if (iso.region) { resource.id1 = iso.region; }
      resource = this._buildResource(resource);

      if (baselayer) {
        this.status.set('subscribe_only', true);
        this.status.set('resource', resource);
        this.setDontAnalyze(null);
        mps.publish('Country/update', [iso]);
        mps.publish('Place/update', [{go: false}]);
        this._subscribeAnalysis();
      }
    },

    setAnalyzeIso: function(iso){
      this._analyzeIso(iso);
    },

    setDontAnalyze: function(dont_analyze) {
      this.status.set('dont_analyze', dont_analyze);
      mps.publish('Analysis/dont_analyze', [this.status.get('dont_analyze')]);
      mps.publish('Place/update', [{go: false}]);
    },

    _analyzeWdpai: function(wdpaid, options) {
      return new Promise(function(resolve) {

      options = options || {analyze: true};

      this.wdpaidBool = (this.wdpaid == wdpaid) ? false : true;
      this.wdpaid = wdpaid;
      this.status.unset('geostore');

      if (this.wdpaidBool) {
        if (options.analyze === true) {
          mps.publish('Spinner/start');
        }

        var resource = this._buildResource({
          wdpaid: _.toNumber(wdpaid),
          type: 'other'
        });

        ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', Wdpaid: ' + resource.wdpaid);
        // Get geojson/fit bounds/draw geojson/publish analysis
        var url = 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_protected_areas where wdpaid =' + wdpaid;
        $.getJSON(url, _.bind(function(data) {
          if (data.rows.length > 0) {
            var geojson = {
              geometry: JSON.parse(data.rows[0].st_asgeojson),
              properties: {},
              type: 'Feature'
            };

            if (options.analyze === true) {
              mps.publish('AnalysisResults/totalArea', [{hectares: geojsonUtilsHelper.getHectares(geojson.geometry)}]);
              this._geojsonFitBounds(geojson);
              this.view.drawMultipolygon(geojson);
              this._publishAnalysis(resource);
            }

            resolve(resource);
            this.wdpaid = null;
            this.wdpaidBool = true;
          } else {
            if (options.analyze === true) {
              this._publishAnalysis(resource, true);
            }
            resolve(resource);
          }
        }, this));
      }

      }.bind(this));
    },

    /**
     * Analyze a concession.
     *
     * @param  {integer} useid Carto db id
     */
    _analyzeConcession: function(useid, layerSlug, options) {
      return new Promise(function(resolve) {

      options = options || { analyze: true };

      if (options.analyze === true) {
        mps.publish('Spinner/start');
      }

      this.status.unset('geostore');
      var resource = this._buildResource({
        useid: _.toNumber(useid),
        use: layerSlug,
        type: 'other'
      });

      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + resource.dataset + ', ConcessionLayer: ' + resource.use + ', ConcessionId: ' + resource.useid);

      var url;
      if (!!concessionsSql[layerSlug]) {
        url = concessionsSql[layerSlug].format(useid);
      } else {
        url = 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from '+ layerSlug +' where cartodb_id =' + useid;
      }

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
          resource.geom = geojson;

          if (options.analyze === true) {
            this._publishAnalysis(resource);
          }
          resolve(resource);
        } else {
          if (options.analyze === true) {
            this._publishAnalysis(resource, true);
          }
          resolve(resource);
        }
      }, this));

      }.bind(this));
    },

    /**
     * Get the geojson from the current and analyze
     * that geojson without drawing again the geom.
     */
    doneDrawing: function() {
      var overlay = this.status.get('overlay');
      var paths = overlay.getPath().getArray();
      var geojson = geojsonUtilsHelper.pathToGeojson(paths);

      this._saveAndAnalyzeGeojson(geojson, {draw: false});
    },

    doneDrawingSubscribe: function() {
      var overlay = this.status.get('overlay');
      var paths = overlay.getPath().getArray();
      var geojson = geojsonUtilsHelper.pathToGeojson(paths);

      this.view.setEditable(overlay, false);

      mps.publish('Spinner/start', [false]);
      GeostoreService.save(geojson).then(function(geostoreId) {
        mps.publish('Spinner/stop');
        this.status.set('geostore', geostoreId);

        var resource = {
          geojson: geojson,
          type: 'geojson'
        };
        resource = this._buildResource(resource);

        var baselayer = this.getBaselayer();

        if (baselayer) {
          this.status.set('subscribe_only', true);
          this.status.set('resource', resource);
          this.setDontAnalyze(null);
          mps.publish('Place/update', [{go: false}]);
          this._subscribeAnalysis();
        }
      }.bind(this));
    },

    /**
     * Build a resource, adding extra options
     * from the current status.
     */
    _buildResource: function(resource) {
      var date, dateFormat = 'YYYY-MM-DD';
      var baselayer = this.status.get('baselayer');

      // Return resource if there isn't a baselayer
      // so we can build the resource later
      // and display a 'unsupported layer' message.
      if (!baselayer) {
        return resource;
      }

      if (this.status.get('geostore')) {
        resource.geostore = this.status.get('geostore');
      }

      var options = this.status.get('layerOptions') || [];
      if (options.length > 0) {
        resource.layer_options = {};
        options.forEach(function(option) {
          resource.layer_options[option] = true;
        });
        resource.layer_options = JSON.stringify(resource.layer_options);
      } else {
        delete resource.layer_options;
      }

      if (resource.geojson) {
        var geojson = geojsonUtilsHelper.featureCollectionToFeature(resource.geojson);
        if (geojson.type === 'Feature') {
          resource.geojson = geojson.geometry;
        }

        resource.geojson = JSON.stringify(resource.geojson);
      }

      resource.dataset = this.datasets[baselayer.slug];

      if (baselayer.slug === 'loss' || baselayer.slug === 'forest2000' || baselayer.slug === 'forestgain') {
        var threshold = this.status.get('threshold');
        if (threshold === undefined || threshold === null) {
          threshold = 30;
        }
        resource.thresh = '?thresh=' + threshold;
      } else {
        // Other layers has thresh = 30, don't they?
        resource.thresh = 30;
      }

      if (baselayer.slug === 'forestgain') {
        date = ['2001-01-01', '2013-12-31'];
      } else {
        date = this.status.get('date');

        if (!date[0]) { date[0] = '2001-01-01'; }
        if (!date[1]) { date[1] = '2014-12-31'; }

        if (baselayer.slug === 'viirs_fires_alerts') {
          date = FiresDatesHelper.getRangeForDates(date);
        }

        date = date.map(function(date) { return moment(date).format(dateFormat); });
      }
      resource.period = '{0},{1}'.format(date[0], date[1]);

      return resource;
    },

    /**
     * Publish an analysis form a suplied resource.
     *
     * @param  {Object} resource The analysis resource
     */
    _publishAnalysis: function(resource, failed) {
      mps.publish('Spinner/start');
      this.status.set('resource', resource);
      mps.publish('Place/update', [{go: false}]);

      //Open tab of analysis
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
        // (resource.iso) ? this.view.putMaskOnTop() : null;
        this._publishAnalysis(resource);
      }
    },

    /**
     * Deletes the current analysis.
     */
    deleteAnalysis: function() {
      mps.publish('Spinner/stop');
      mps.publish('AnalysisResults/Delete');

      this.view._removeCartodblayer();
      this.view.$el.removeClass('is-analysis');

      // Delete overlay drawn or multipolygon.
      this.view.deleteGeom({
        overlay: this.status.get('overlay'),
        multipolygon: this.status.get('multipolygon')
      });

      this.view.setSelects({ country: null, region: null }, this.status.get('dont_analyze'));

      // Reset status model
      this.status.set({
        resource: null,
        overlay: null,
        polygon: null,
        multipolygon: null
      });

      mps.publish('Subscribe/clearIso', []);
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
      } else {
        baselayer = baselayers[_.first(_.intersection(
          _.pluck(baselayers, 'slug'),
          _.keys(this.datasets)))];
      }

      mps.publish('Analysis/enabled', [!!baselayer]);
      $('#analyzeBtn').toggleClass('dont-analyze', !!!baselayer);
      this.status.set('baselayer', baselayer);
      this._setAnalysisBtnVisibility();
    },

    _setAnalysisBtnVisibility: function() {
      this.view.toggleBtn(!!!this.status.get('baselayer'));
    },

    toggleVisibilityAnalysis: function(to){
      mps.publish('Analysis/visibility', [to]);
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
      this.deleteMultiPoligon();
      this.status.set('multipolygon', multipolygon);
      mps.publish('AnalysisTool/iso-drawn', [geojson.geometry]);
    },

    deleteMultiPoligon: function(){
      this.view.deleteGeom({
        overlay: this.status.get('overlay'),
        multipolygon: this.status.get('multipolygon')
      });
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

      p.dont_analyze = this.status.get('dont_analyze');

      if (resource.iso) {
        p.iso = {};
        p.iso.country = resource.iso;
        p.iso.region = resource.id1 ? resource.id1 : null;
      } else if (resource.geostore) {
        p.geostore = resource.geostore;
      } else if (resource.geojson) {
        p.geojson = encodeURIComponent(resource.geojson);
      } else if (resource.wdpaid) {
        p.wdpaid = resource.wdpaid;
      } else if (resource.use && resource.useid) {
        p.use = resource.use;
        p.useid = resource.useid;
      }

      if (this.status.get('fit_to_geom')) {
        p.fit_to_geom = 'true';
      }

      if (this.status.get('tab')) {
        p.tab = this.status.get('tab');
      }

      return p;
    },

    getBaselayer: function() {
      return this.status.get('baselayer');
    },

    toggleOverlay: function(to){
      mps.publish('Overlay/toggle', [to]);
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    layerAvailableForSubscription: function() {
      var baselayer = this.status.get('baselayer');
      var subscriptionsAllowed = datasetsHelper.getListSubscriptionsAllowed();
      mps.publish('Subscribe/enabled', [(baselayer && subscriptionsAllowed.indexOf(baselayer.slug) > -1)]);
      return (baselayer && subscriptionsAllowed.indexOf(baselayer.slug) > -1);
    }

  });

  return AnalysisToolPresenter;

});
