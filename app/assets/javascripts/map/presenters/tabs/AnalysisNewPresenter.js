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
        type: null,
        enabled: true,
        active: false,
        threshold: 30,
        
        dates: {
          begin: null,
          end: null
        },

        // Country
        iso: null,
        isoEnabled: false,

        // Shape
        geostore: null
      }
    })),

    datasets: {
      'loss': {
        slug: 'umd-loss-gain',
        subscription: true
      },
      'forestgain': {
        slug: 'umd-loss-gain'
      },
      'forma': {
        slug: 'forma-alerts'
      },
      'imazon': {
        slug: 'imazon-alerts',
        subscription: true
      },
      'modis': {
        slug: 'quicc-alerts',
        subscription: true        
      },
      'terrailoss': {
        slug: 'terrai-alerts',
        subscription: true
      },
      'prodes': {
        slug: 'prodes-loss',
        subscription: true
      },
      'guyra': {
        slug: 'guyra-loss',
        subscription: true
      },
      'forest2000': {
        slug: 'umd-loss-gain'
      },
      'viirs_fires_alerts': {
        slug: 'viirs-active-fires',
        subscription: true
      },
      'umd_as_it_happens': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_per': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_cog': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_idn': {
        slug: 'glad-alerts',
        subscription: true
      },
    },

    init: function(view) {
      this.view = view;
      this._super();
      mps.publish('Place/register', [this]);
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
     * Application subscriptions.
     */
    _subscriptions: [
      {
        'Place/go': function(place) {
          var params = place.params;
          this.status.set('geostore', params.geostore);
        }
      },
      // DRAWING EVENTS
      {
        'Analysis/start-drawing': function() {
          
        }
      },{
        'Analysis/stop-drawing': function() {
          
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
      // ANALYSIS EVENTS
      {
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      }
    ],

    /**
     * MPS EVENTS
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

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

  });

  return AnalysisNewPresenter;

});
