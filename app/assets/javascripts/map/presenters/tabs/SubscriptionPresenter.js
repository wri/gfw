/**
 * The SubscriptionPresenter class for the AnalysisToolView.
 *
 * @return SubscriptionPresenter class.
 */
define([
  'map/presenters/PresenterClass', 'underscore', 'backbone', 'mps', 'topojson',
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
      disableUpdating: false,
      dont_analyze: false
    }
  });

  var concessionsSql = {
    'logging': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_logging where cartodb_id ={0}',
    'mining':'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_mining where cartodb_id ={0}',
    'oilpalm': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_oil_palm where cartodb_id ={0}',
    'fiber': 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_wood_fiber where cartodb_id ={0}'
  };

  var SubscriptionPresenter = PresenterClass.extend({

    datasets: {
      'loss': 'umd-loss-gain',
      'forestgain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts',
      'terrailoss': 'terrai-alerts',
      'prodes': 'prodes-loss',
      'guyra': 'guyra-loss',
      'forest2000': 'umd-loss-gain'
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
        this.status.set('dont_analyze', place.params.dont_analyze);
        this._handlePlaceGo(place.params);
      }
    }, {
      'Subscribe/end': function(options) {
        this.deleteSubscription();
      }
    },{
      'Subscription/iso': function(iso) {
        this.openSubscriptionTab(true);
        this.view._onClickStart();
        this.view._stopDrawing();
        this.deleteSubscription();
        this.view.setStyle();
        this._subscribeIso(iso);
      }
    },{
      'Subscription/analyze-wdpaid': function(wdpaid) {
        this.openSubscriptionTab(true);
        this.view._onClickStart();
        this.view._stopDrawing();
        this.deleteSubscription();
        this.view.setStyle();
        this._subscribeWdpai(wdpaid.wdpaid);
      }
    }, {
      'Subscription/analyze-concession': function(useid, layerSlug, wdpaid) {
        if (wdpaid && wdpaid != "") {
          wdpaid = {wdpaid : wdpaid}
          mps.publish('Subscription/analyze-wdpaid', [wdpaid]);
          return;
        }
        this.openSubscriptionTab(true);
        this.view._onClickStart();
        this.view._stopDrawing();
        this.deleteSubscription();
        this.view.setStyle();
        this._subscribeConcession(useid, layerSlug);
      }
    },{
      'Tab/opened': function(id) {
        if (id === 'subscription-tab') {
          this.view.model.set('hidden',false);
        }else{
          this.view.model.set('hidden',true);
          if (this.view.model.get('is_drawing')) {
            this.view._stopDrawing();
            mps.publish('Subscribe/hide');
          }else{
            mps.publish('Subscribe/hide');
          }
        }
      },
    }, {
      'Subscription/upload':function(geojson) {
        this._subscribeGeojson(geojson,{draw: false});
      }
    }, {
      'Subscribe/end': function() {
        this.view._stopDrawing();
      }
    }],

    openSubscriptionTab: function() {
      mps.publish('Tab/open', ['#subscription-tab-button']);
    },

    _handlePlaceGo: function(params) {
      if (params.tab !== 'subscription-tab') { return; }

      this.openSubscriptionTab();
      var areaIsSelected = (params.iso.country || params.geojson || params.wdpaid);

      if (areaIsSelected) {
        this.view._onClickStart();

        if (params.geojson) {
          var resource = {
            geojson: JSON.stringify(params.geojson),
            type: 'geojson'
          };
          resource = this._buildResource(resource);
          this.status.set('resource', resource);

          this.view.openTab('geojson');
          this.view._onClickSubscription();

          this.deleteMultiPoligon();
          this.view.setSelects({country: null, region: null});
          this.view.model.set('is_drawing', true);
          var overlay = this.view.drawPaths(
            geojsonUtilsHelper.geojsonToPath(params.geojson));
          this.view._onOverlayComplete({
            type: 'polygon',
            overlay: overlay
          });

          if (params.subscribe) {
            this._publishSubscribe(resource);
          }

          return;
        }

        if (params.wdpaid) {
          this._showWdpa(params.wdpaid);
          return;
        }

        if (params.iso.country && params.iso.country !== 'ALL') {
          this.view.openTab('iso');
          this._showIso(params.iso);
        }

        if (params.sublayers.length > 0) {
          this.view.openTab('other');
          return;
        }
      }
    },

    _setBaselayer: function(baselayers) {
      var baselayer;
      if (baselayers.loss) {
        baselayer = baselayers.loss;
        this.status.set('both', (baselayers.forestgain) ? true : false);
      } else {
        baselayer = baselayers[_.first(_.intersection(
          _.pluck(baselayers, 'slug'),
          _.keys(this.datasets)))];
      }
      this.status.set('baselayer', baselayer);
    },

    _showGeojson: function(geojson, options) {
      options = options || {draw: true};

      this.view.setStyle();
      var resource = {
        geojson: JSON.stringify(geojson),
        type: 'geojson'
      };
      resource = this._buildResource(resource);
      this.status.set('resource', resource);

      // Draw geojson if needed.
      if (options.draw) {
        this.view.drawPaths(
          geojsonUtilsHelper.geojsonToPath(geojson));
      }

      return resource;
    },

    /**
     * Analyzes a geojson object.
     *
     * @param  {[type]} geojson [description]
     */
    _subscribeGeojson: function(geojson, options) {
      var resource = this._showGeojson(geojson, options);

      ga('send', 'event', 'Map', 'Subscription', 'Layer: ' + resource.dataset + ', Polygon: true');
      this._publishSubscribe(resource);
    },

    /**
     * Analyze country/region by iso.
     *
     * @param  {Object} iso {country: {string}, id: {integer}}
     */
    _showIso: function(iso, callback) {
      callback = callback || function(){};

      this.deleteSubscription();
      this.view.setStyle();
      this.view.setSelects(iso, this.status.get('dont_analyze'));

      // Build resource
      var resource = {
        iso: iso.country,
        type: 'iso'
      };
      if (iso.region) {
        resource.id1 = iso.region;
      }
      resource = this._buildResource(resource);
      ga('send', 'event', 'Map', 'Subscription', 'Layer: ' + resource.dataset + ', Iso: ' + resource.iso.country);

      if (!iso.region) {
        // Get geojson/fit bounds/draw geojson/publish analysis.
        countryService.execute(resource.iso, _.bind(function(results) {
          var objects = _.findWhere(results.topojson.objects, {
            type: 'MultiPolygon'
          });

          var geojson = topojson.feature(results.topojson,
            objects);

          this._geojsonFitBounds(geojson);
          this.view.drawCountrypolygon(geojson,'#F00');

          // Show subscription dialog
          resource.geom = geojson;
          this.status.set('resource', resource);

          callback(resource);
        },this));
      } else {
        regionService.execute(resource, _.bind(function(results) {
          var geojson = results.features[0];
          this._geojsonFitBounds(geojson);
          this.view.drawCountrypolygon(geojson,'#F00');

          // Show subscription dialog
          resource.geom = geojson;
          this.status.set('resource', resource);

          callback(resource);
        },this));
      }
    },

    _subscribeIso: function(iso) {
      this._showIso(iso, this._publishSubscribe.bind(this));
    },

    setSubscriptionIso: function(iso){
      this._subscribeIso(iso);
    },

    _showWdpa: function(wdpaid, callback) {
      callback = callback || function(){};

      // Build resource
      var resource = this._buildResource({
        wdpaid: wdpaid,
        type: 'other'
      });

      ga('send', 'event', 'Map', 'Subscription', 'Layer: ' + resource.dataset + ', Wdpaid: ' + resource.wdpaid);
      // Get geojson/fit bounds/draw geojson/publish analysis
      var url = 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_protected_areas where wdpaid =' + wdpaid;
      $.getJSON(url, _.bind(function(data) {
        if (data.rows.length > 0) {
          var geojson = {
            geometry: JSON.parse(data.rows[0].st_asgeojson),
            properties: {},
            type: 'Feature'
          };

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          resource.geom = geojson;
          this.status.set('resource', resource);
          callback(resource);
        } else {
          this.status.set('resource', resource);
          callback(resource, true);
        }
      }, this));
    },

    _subscribeWdpai: function(wdpaid) {
      this._showWdpa(wdpaid, this._publishSubscribe.bind(this));
    },

    /**
     * Analyze a concession.
     *
     * @param  {integer} useid Carto db id
     */
    _subscribeConcession: function(useid, layerSlug) {
      var resource = this._buildResource({
        useid: useid,
        use: layerSlug,
        type: 'other'
      });

      ga('send', 'event', 'Map', 'Subscription', 'Layer: ' + resource.dataset + ', ConcessionLayer: ' + resource.use + ', ConcessionId: ' + resource.useid);

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

          this._geojsonFitBounds(geojson);
          this.view.drawMultipolygon(geojson);
          resource.geom = geojson;
          this.status.set('resource', resource);

          this._publishSubscribe(resource);
        } else {
          this._publishSubscribe(resource, true);
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

      this._subscribeGeojson(geojson, {draw: false});
    },

    /**
     * Build a resource, adding extra options
     * from the current status.
     */
    _buildResource: function(resource) {
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
        date[1] = (date[1] != null) ? date[1] : '2014-12-31';
        resource.period = '{0},{1}'.format(
          date[0].format(dateFormat), date[1].format(dateFormat));

        // this is super ugly
        if (baselayer.slug === 'loss' || baselayer.slug === 'forest2000') {
          resource.thresh = '?thresh=' + ((this.status.get('threshold') === null) ? 30 :  this.status.get('threshold'));
        } else {
          delete resource.thresh;
        }

        return resource;
      } else {
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
    _publishSubscribe: function() {
      mps.publish('Place/update', [{go: false}]);

      var options = {
        analysisResource: this.status.get('resource'),
        layer: this.status.get('baselayer')
      };

      mps.publish('Subscribe/show', [options]);
      this.view.$el.addClass('is-subscribing');
    },

    /**
     * Deletes the current analysis.
     */
    deleteSubscription: function() {
      // Delete overlay drawn or multipolygon.
      this.view.deleteGeom({
        overlay: this.status.get('overlay'),
        multipolygon: this.status.get('multipolygon')
      });

      this.view.setSelects({ country: null, region: null });

      // Reset status model
      this.status.set({
        resource: null,
        overlay: null,
        polygon: null,
        multipolygon: null
      });

      this.view.$el.removeClass('is-subscribing');
      mps.publish('Place/update', [{go: false}]);
    },

    resetIsos: function(){
      mps.publish('LocalMode/updateIso', [{country:null, region:null}]);
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

      var paths = e.overlay.getPath().getArray(),
          geojson = geojsonUtilsHelper.pathToGeojson(paths);
      this._showGeojson(geojson, {draw: false});
      mps.publish('Place/update', [{go: false}]);
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
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    }

  });

  return SubscriptionPresenter;

});
