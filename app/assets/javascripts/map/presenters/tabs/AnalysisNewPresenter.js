/**
 * The AnalysisNewPresenter class for the AnalysisToolView.
 *
 * @return AnalysisNewPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 
  'backbone', 
  'mps', 
  'topojson', 
  'bluebird', 
  'moment',
  'helpers/geojsonUtilsHelper',
  'map/services/CountryService',
  'map/services/RegionService',
  'map/services/GeostoreService'
], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, geojsonUtilsHelper, countryService, regionService, GeostoreService) {

  'use strict';

  var AnalysisNewPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        // Analysis
        type: null,

        enabled: true,
        active: false,
        activeSubscription: false,
        
        // Layers
        baselayers: [],
        baselayer: null,

        // Options
        threshold: 30,
        
        // Dates
        begin: null,
        end: null,

        // Country
        iso: null,
        isoEnabled: false,

        // Draw
        geostore: null,
        isDrawing: false
      }
    })),

    datasets: [{
        name: 'loss',
        slug: 'umd-loss-gain',
        subscription: true
      },{
        name: 'forestgain',
        slug: 'umd-loss-gain'
      },{
        name: 'forest2000',
        slug: 'umd-loss-gain'
      },{
        name: 'forma',
        slug: 'forma-alerts'
      },{
        name: 'imazon',
        slug: 'imazon-alerts',
        subscription: true
      },{
        name: 'modis',
        slug: 'quicc-alerts',
        subscription: true        
      },{
        name: 'terrailoss',
        slug: 'terrai-alerts',
        subscription: true
      },{
        name: 'prodes',
        slug: 'prodes-loss',
        subscription: true
      },{
        name: 'guyra',
        slug: 'guyra-loss',
        subscription: true
      },{
        name: 'viirs_fires_alerts',
        slug: 'viirs-active-fires',
        subscription: true
      },{
        name: 'umd_as_it_happens',
        slug: 'glad-alerts',
        subscription: true
      },{
        name: 'umd_as_it_happens_per',
        slug: 'glad-alerts',
        subscription: true
      },{
        name: 'umd_as_it_happens_cog',
        slug: 'glad-alerts',
        subscription: true
      },{
        name: 'umd_as_it_happens_idn',
        slug: 'glad-alerts',
        subscription: true
      },
    ],

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
      mps.publish('Place/register', [this]);
    },

    listeners: function() {
      this.status.on('change:baselayers', this.changeBaselayers.bind(this));
      this.status.on('change:enabled', this.changeEnabled.bind(this));
      this.status.on('change:enabledSubscription', this.changeEnabledSubscription.bind(this));
      this.status.on('change:geostore', this.changeGeostore.bind(this));
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      if (!!this.status.get('geostore')) {
        p.geostore = this.status.get('geostore');
      }
      // var resource = this.status.get('resource');
      // if (!resource) {return;}
      // var p = {};

      // p.dont_analyze = this.status.get('dont_analyze');

      // if (resource.iso) {
      //   p.iso = {};
      //   p.iso.country = resource.iso;
      //   p.iso.region = resource.id1 ? resource.id1 : null;
      // } else if (resource.geostore) {
      //   p.geostore = resource.geostore;
      // } else if (resource.geojson) {
      //   p.geojson = encodeURIComponent(resource.geojson);
      // } else if (resource.wdpaid) {
      //   p.wdpaid = resource.wdpaid;
      // } else if (resource.use && resource.useid) {
      //   p.use = resource.use;
      //   p.useid = resource.useid;
      // }

      // if (this.status.get('fit_to_geom')) {
      //   p.fit_to_geom = 'true';
      // }

      // if (this.status.get('tab')) {
      //   p.tab = this.status.get('tab');
      // }
      return p;
    },

    /**
     * Analysis subscriptions.
     */
    _subscriptions: [

      // GLOBAL EVENTS
      {
        'Place/go': function(place) {
          var params = place.params;
          
          // Baselayer
          this.status.set('baselayers', _.pluck(params.baselayers, 'slug'));
          
          // Dates
          this.status.set('begin', params.begin);
          this.status.set('end', params.begin);
          
          // Geostore
          this.status.set('geostore', params.geostore);
          
          // Countries
          this.status.set('iso', {
            country: params.country,
            region: params.region
          });
          this.status.set('isoEnabled', params.dont_analyze);
          
          // Threshold
          this.status.set('threshold', params.threshold);
        }
      },
      {
        'LayerNav/change': function(layerSpec) {
          var currentBaselayers = this.status.get('baselayers');
          var newBaselayers = _.keys(layerSpec.getBaselayers());
          
          var baselayers_change = !!_.difference(currentBaselayers, newBaselayers).length || !!_.difference(newBaselayers, currentBaselayers).length;
          if (baselayers_change) {
            this.status.set('baselayers', _.keys(layerSpec.getBaselayers()));
          }
          

          // var baselayer = this.status.get('baselayer');
          // var both = this.status.get('both');
          // var loss_gain_and_extent = this.status.get('loss_gain_and_extent');
          // this._setBaselayer(layerSpec.getBaselayers());
          // this.status.set('loss_gain_and_extent', layerSpec.checkLossGainExtent());

          // this.view.toggleCountrySubscribeBtn();
          // this.view.toggleDoneSubscribeBtn();

          // if (this.status.get('baselayer') != baselayer) {
          //   this._updateAnalysis();
          //   this.openAnalysisTab();
          // }else{
          //   if (this.status.get('both') != both) {
          //     this._updateAnalysis();
          //     this.openAnalysisTab();
          //   }
          // }

          // if (loss_gain_and_extent != this.status.get('loss_gain_and_extent')) {
          //   this._updateAnalysis();
          //   this.openAnalysisTab();          
          // }
        }
      },      
      // DRAWING EVENTS
      {
        'Analysis/start-drawing': function() {
          this.status.set('isDrawing', true);
        }
      },{
        'Analysis/stop-drawing': function() {
          this.status.set('isDrawing', false);
        }
      },{
        'Analysis/store-geojson': function(geojson) {
          if (!!geojson) {        
            GeostoreService.save(geojson).then(function(geostoreId) {
              this.status.set('geostore', geostoreId);
              mps.publish('Place/update', [{go: false}]);
            }.bind(this));
          } else {
            this.status.set('geostore', null);
            mps.publish('Place/update', [{go: false}]);
          }
        }
      },
      // GLOBAL ANALYSIS EVENTS
      {
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      }
    ],





    /**
     * LISTENERS
     *
     */    
    changeBaselayers: function() {
      // Check which baselayers are analysis-allowed
      var enabled = !!_.intersection(
        this.status.get('baselayers'),
        _.pluck(this.datasets, 'name')
      ).length;

      // Check which baselayers are subscription-allowed
      var enabledSubscription = !!_.intersection(
        this.status.get('baselayers'),
        _.pluck(_.where(this.datasets, {subscription: true}), 'name')
      ).length;
      
      this.status.set('enabled', enabled);
      this.status.set('enabledSubscription', enabledSubscription);
    },

    changeEnabled: function() {
      var enabled = this.status.get('enabled');
      this.view.setEnabled(enabled);

      mps.publish('Analysis/enabled', [enabled]);
      if (!enabled) {
        mps.publish('Tab/toggle', ['analysis-tab',enabled]);
      }
    },

    changeEnabledSubscription: function() {
      mps.publish('Analysis/enabled-subscription', [this.status.get('enabledSubscription')]);
    },

    changeGeostore: function() {
      if (!!this.status.get('geostore')) {
        console.log('****** analyze geostore **********');  
      }
    },




    /**
     * ACTIONS
     * deleteAnalysis
     * @return {void}
     */    
    deleteAnalysis: function() {
      // this.view.deleteAnalysis();
      this.status.set('type', null);
      this.status.set('active', false);
      this.status.set('geostore', null);
      this.status.set('isoEnabled', false);
      this.status.set('iso', {
        country: null,
        region: null
      });
    },

    /**
     * publishEnabled
     * @return {void}
     */
    publishEnabled: function() {
      mps.publish('Analysis/enabled', this.status.get('active'));
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

  });

  return AnalysisNewPresenter;

});
