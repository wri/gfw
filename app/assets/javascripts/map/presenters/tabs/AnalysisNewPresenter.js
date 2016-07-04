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
  'bluebird', 
  'moment',
  'helpers/geojsonUtilsHelper',
  'map/services/CountryService',
  'map/services/RegionService',
  'map/services/GeostoreService'
], function(PresenterClass, _, Backbone, mps, Promise, moment, geojsonUtilsHelper, countryService, regionService, GeostoreService) {

  'use strict';

  var AnalysisNewPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        // Analysis
        type: null,

        enabled: false,
        enabledSubscription: false,
        enabledUpdating: true,

        active: false,
        spinner: false,
        subtab: 'default',
        
        // Layers
        baselayers: [],
        baselayer: null,

        // Options
        threshold: 30,
        
        // Dates
        begin: null,
        end: null,

        // Country
        iso: {
          country: null,
          region: null
        },
        isoDisabled: false,

        // Areas
        wdpaid: null,
        use: null,
        useid: null,

        // Draw
        geostore: null,
        isDrawing: false
      }
    })),

    types: [
      // GEOSTORE
      {
        name: 'geostore',
        type: 'draw',
        subtab: 'draw'
      },
      
      // AREAS
      {
        name: 'wdpaid',
        type: 'wdpaid',
        subtab: 'shape'
      },
      {
        name: 'use',
        type: 'use',
        subtab: 'shape'
      },
      {
        name: 'useid',
        type: 'use',
        subtab: 'shape'
      },
      
      // COUNTRY
      {
        name: 'iso',
        type: 'country',
        subtab: 'country'
      },
      {
        name: 'isoDisabled',
        type: 'country',
        subtab: 'country'
      },
    ],

    datasets: [
      {
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
      // dev
      this.status.on('change', function(){
        mps.publish('Place/update', [{go: false}]);
      }.bind(this));

      // Baselayers
      this.status.on('change:baselayers', this.changeBaselayers.bind(this));
      this.status.on('change:baselayer', this.changeBaselayer.bind(this));

      // Enabled
      this.status.on('change:enabled', this.changeEnabled.bind(this));
      this.status.on('change:enabledSubscription', this.changeEnabledSubscription.bind(this));


      // Dates
      this.status.on('change:begin', this.changeDate.bind(this));
      this.status.on('change:end', this.changeDate.bind(this));

      // Threshold
      this.status.on('change:threshold', this.changeThreshold.bind(this));

      // Geostore
      this.status.on('change:geostore', this.changeGeostore.bind(this));
      
      // Countries
      this.status.on('change:isoDisabled', this.changeIso.bind(this));
      this.status.on('change:iso', this.changeIso.bind(this));

      // Areas
      this.status.on('change:use', this.changeUse.bind(this));
      this.status.on('change:wdpaid', this.changeWdpaid.bind(this));

      // Spinner
      this.status.on('change:spinner', this.changeSpinner.bind(this));
      this.status.on('change:subtab', this.changeSubtab.bind(this));
      
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      // Countries
      p.dont_analyze = !!this.status.get('isoDisabled');
      
      // Geostore
      if (!!this.status.get('geostore')) {
        p.geostore = this.status.get('geostore');
      }
      

      if (!!this.status.get('iso') && !!this.status.get('isoDisabled')) {
        p.iso = this.status.get('iso');
      }      

      // Areas
      if (!!this.status.get('wdpaid')) {
        p.wdpaid = this.status.get('wdpaid');
      }

      if (!!this.status.get('use') && !!this.status.get('useid')) {
        p.use = this.status.get('use');
        p.useid = this.status.get('useid');
      }

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
          
          this.status.set({
            // Countries
            iso: {
              country: params.iso.country,
              region: params.iso.region              
            },
            isoDisabled: (!!params.dont_analyze) || !(!!params.iso.country && params.iso.country != 'ALL'),
            
            // Baselayer
            baselayers: _.pluck(params.baselayers, 'slug'),

            // Dates
            begin: params.begin,
            end: params.end,
            
            // Threshold
            threshold: params.threshold,

            // Geostore
            geostore: params.geostore,
            
            // Areas
            wdpaid: params.wdpaid,
            use: params.use,
            useid: params.useid,
          })
          
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
        }
      },      
      {
        'Threshold/update': function(threshold) {
          this.status.set('threshold', threshold);
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
            }.bind(this));
          } else {
            this.status.set('geostore', null);
          }
        }
      },


      // COUNTRY EVENTS
      {
        'Analysis/iso': function(iso, isoDisabled) {
          this.status.set({
            iso: iso,
            isoDisabled: isoDisabled
          });
        }
      },


      // AREAS
      {
        'Analysis/areas': function(useid, use, wdpaid) {
          this.status.set('useid', useid);
          this.status.set('use', use);
          this.status.set('wdpaid', wdpaid);
        }
      },

      // TIMELINE
      {
        'Timeline/date-change': function(layerSlug, date) {
          var dateFormat = 'YYYY-MM-DD';
          var date = date.map(function(date) { 
            return moment(date).format(dateFormat); 
          });
          
          this.status.set('begin', date[0]);
          this.status.set('end', date[1]);
        }
      }, 
      {
        'Timeline/start-playing': function() {
          this.status.set('enabledUpdating', false);
        }
      }, 
      {
        'Timeline/stop-playing': function() {
          this.status.set('enabledUpdating', true);
        }
      },


      // GLOBAL ANALYSIS EVENTS
      {
        'Analysis/subtab': function(subtab) {
          this.status.set('subtab', subtab);
        }
      },
      {
        'Analysis/active': function(active) {
          this.status.set('active', active);
        }
      },
      {
        'Analysis/type': function(type) {
          this.status.set('type', type);
        }
      },
      {
        'Analysis/delete': function(options) {
          this.deleteAnalysis(options);
        }
      }
    ],





    /**
     * LISTENERS
     *
     */    
    changeBaselayers: function() {
      // Set the baselayer to analyze
      this.status.set('baselayer', this.setBaselayer());

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

    changeBaselayer: function() {
      this.publishAnalysis();
    },

    changeActive: function() {
      this.publishAnalysis();
    },

    changeSpinner: function() {
      this.view.toggleSpinner();
    },

    changeEnabled: function() {
      var enabled = this.status.get('enabled');
      mps.publish('Analysis/enabled', [enabled]);
      this.view.toggleEnabledButtons();
      
      // Hide analysis tab if it's not enabled 
      // to make an analysis
      if (!enabled) {
        mps.publish('Tab/toggle', ['analysis-tab',enabled]);
      }
    },

    changeEnabledSubscription: function() {
      mps.publish('Analysis/enabled-subscription', [this.status.get('enabledSubscription')]);
    },

    changeDate: function() {
      this.publishAnalysis();
    },

    changeThreshold: function() {
      this.publishAnalysis();
    },

    changeSubtab: function() {
      this.view.toggleSubtab();
    },

    /**
     * 4 TYPES OF ANALYSIS
     * - changeGeostore
     * - changeIso
     * - changeWdpaid
     * - changeUse
     */
    changeGeostore: function() {
      if (!!this.status.get('geostore')) {
        this.status.set({
          active: true,
          type: 'draw'
        }, { 
          silent: true 
        });

        this.deleteAnalysis({ 
          silent: true
        });
        this.publishAnalysis();
      }
    },

    changeIso: function() {
      if (!!this.status.get('iso').country && this.status.get('iso').country != 'ALL') {
        if (!this.status.get('isoDisabled')) {
          this.status.set({
            active: true,
            type: 'country'
          }, { 
            silent: true 
          });
  
          this.deleteAnalysis({ 
            silent: true
          });       
          this.publishAnalysis();
        }                
      }
    },

    changeWdpaid: function() {
      if (!!this.status.get('wdpaid')) {
        this.status.set({
          active: true,
          type: 'wdpaid'
        }, { 
          silent: true 
        });

        this.deleteAnalysis({ 
          silent: true
        });
        this.publishAnalysis();
      }
    },

    changeUse: function() {
      if (!!this.status.get('use')) {
        this.status.set({
          active: true,
          type: 'use'
        }, { 
          silent: true 
        });

        this.deleteAnalysis({ 
          silent: true
        });
        this.publishAnalysis();
      }
    },


    /**
     * ACTIONS
     * - setBaselayer
     * - setAnalysis
     * - publishAnalysis
     * - deleteAnalysis
     * @return {void}
     */
    setBaselayer: function() {
      return _.uniq(_.pluck(_.filter(this.datasets, function(dataset){
        return _.contains(this.status.get('baselayers'), dataset.name)
      }.bind(this)), 'slug'));
    },    

    setAnalysis: function() {
      switch(this.status.get('type')) {
        case 'draw':
          console.log('Analysis draw');
        break;
        case 'country':
          mps.publish('Country/update', [this.status.get('iso')])
          console.log('Analysis country');
        break;
        case 'wdpaid':
          console.log('Analysis wdpaid');
        break;
        case 'use':
          console.log('Analysis use');
        break;
      }
      console.log(this.status.toJSON());
    },

    publishAnalysis: function() {
      // 1. Check if analysis is active
      if (this.status.get('active') && !!this.status.get('enabledUpdating')) {
        this.status.set('spinner', true);
        this.setAnalysis();
      }
    },

    publishDeleteAnalysis: function() {
      this.status.set('type', null);
      mps.publish('Analysis/delete');
    },

    deleteAnalysis: function(options) {
      var type = this.status.get('type');
      var statusFiltered = (!!type) ? _.filter(this.types, function(v){
        return v.type != type;
      }.bind(this)) : this.types;
      
      // If type exists delete all stuff related 
      // to other analysis
      _.each(statusFiltered, function(v){
        switch(v.name) {
          case 'iso':
            this.status.set('iso', {
              country: null,
              region: null
            }, options);  
          break;
          case 'isoDisabled':
            this.status.set('isoDisabled', true);              
          break;
          default:
            this.status.set(v.name, null, options);  
          break;
        }
      }.bind(this));
      
      // If type doesn't exist remove type, active and enabledUpdating
      if (! !!type) {
        this.status.set('type', null, options);
        this.status.set('active', false, options);
        this.status.set('enabledUpdating', true, options);
      }

      this.status.set('spinner', false);

      mps.publish('Place/update', [{go: false}]);
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

  });

  return AnalysisNewPresenter;

});
