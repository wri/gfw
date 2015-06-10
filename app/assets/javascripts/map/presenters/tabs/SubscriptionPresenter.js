/**
 * The SubscriptionPresenter class for the AnalysisToolView.
 *
 * @return SubscriptionPresenter class.
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
      'terrailoss': 'terrai-alerts'
    },

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Subscribe/end': function(options) {
        this.deleteSubscription();
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
    }],

    openSubscriptionTab: function(open){
      mps.publish('Tab/open', ['#subscription-tab-button']);
    },


    /**
     * Analyzes a geojson object.
     *
     * @param  {[type]} geojson [description]
     */
    _subscribeGeojson: function(geojson, options) {
      options = options || {draw: true};
      this.view.setStyle();
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
      ga('send', 'event', 'Map', 'Subscription', 'Layer: ' + resource.dataset + ', Polygon: true');
      this._publishSubscribe(resource);
    },

    /**
     * Analyze country/region by iso.
     *
     * @param  {Object} iso {country: {string}, id: {integer}}
     */
    _subscribeIso: function(iso) {
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
          this._publishSubscribe(resource);


        },this));
      } else {
        regionService.execute(resource, _.bind(function(results) {
          var geojson = results.features[0];
          this._geojsonFitBounds(geojson);
          this.view.drawCountrypolygon(geojson,'#F00');

          // Show subscription dialog
          resource.geom = geojson;
          this._publishSubscribe(resource);

        },this));
      }
    },

    setSubscriptionIso: function(iso){
      this._subscribeIso(iso);
    },

    _subscribeWdpai: function(wdpaid) {
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
          this._publishSubscribe(resource);

        } else {
          this._publishSubscribe(resource, true);
        }
      }, this));
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

      var url = function() {
        if (!!concessionsSql[layerSlug])
          return concessionsSql[layerSlug].format(useid);
        else
          return 'http://wri-01.cartodb.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from '+ layerSlug +' where cartodb_id =' + useid;
      }();

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

      this.view.setEditable(overlay, false);
      this._subscribeGeojson(geojson, {draw: false});
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
        date[1] = (date[1] != null) ? date[1] : '2014-12-31';
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
    _publishSubscribe: function(resource, failed) {
      this.status.set('resource', resource);
      var options = {
        analysisResource: this.status.get('resource')
      };

      mps.publish('Spinner/stop');
      mps.publish('Subscribe/show', [options]);
      this.view.$el.addClass('is-subscribing')
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

      this.view.$el.removeClass('is-subscribing')
    },

    resetIsos: function(){
      mps.publish('LocalMode/updateIso', [{country:null, region:null}])
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
    },


  });

  return SubscriptionPresenter;

});
