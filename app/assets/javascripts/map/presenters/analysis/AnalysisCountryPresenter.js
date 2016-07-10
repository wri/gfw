/**
 * The AnalysisCountryPresenter class for the AnalysisToolView.
 *
 * @return AnalysisCountryPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 
  'backbone', 
  'mps', 
  'topojson', 
  'bluebird', 
  'moment',
  'map/services/CountryService',
  'helpers/geojsonUtilsHelper',  

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, countryService, geojsonUtilsHelper) {

  'use strict';

  var AnalysisCountryPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        iso : {
          country: 'ALL',
          region: null
        },
        isoEnabled: false,

        enabled: true,
        enabledSubscription: true
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      this.status.on('change:iso', this.changeIso.bind(this));
      this.status.on('change:isoDisabled', this.changeIso.bind(this));

      this.status.on('change:enabled', this.changeEnabled.bind(this));
      this.status.on('change:enabledSubscription', this.changeEnabledSubscription.bind(this));
    },

    /**
     * Application subscriptions.
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
          });
        }
      },
      
      // GLOBAL ANALYSIS EVENTS
      {
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/shape': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/enabled': function(enabled) {
          this.status.set('enabled', enabled);
        }
      },{
        'Analysis/enabled-subscription': function(enabled) {
          this.status.set('enabledSubscription', enabled);
        }
      },{
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/iso': function(iso,isoDisabled) {
          this.status.set('isoDisabled', isoDisabled);
          if(!!iso.country && iso.country !== 'ALL' && !isoDisabled){
            this.status.set({
              iso: iso,
              isoDisabled: isoDisabled
            });
          }
        }
      }
    ],

    /**
     * LISTENERS
     */
    changeIso: function() {
      var iso = this.status.get('iso');
      var isoDisabled = this.status.get('isoDisabled');
      this.view.setSelects();
      this.view.toggleEnabledButtons();
      if (!!iso.country && iso.country != 'ALL' && !isoDisabled) {
        this.countryGeojson();
      }
      mps.publish('Analysis/iso', [iso, isoDisabled])
    },

    changeEnabled: function() {
      this.view.toggleEnabledButtons();
    },

    changeEnabledSubscription: function() {
      this.view.toggleEnabledButtons();
    },

    countryGeojson: function() {
      var iso = this.status.get('iso');

      countryService.show(iso.country)
        .then(function(results,status) {
          var objects = _.findWhere(results.topojson.objects, {
            type: 'MultiPolygon'
          });
          var geojson = topojson.feature(results.topojson,objects),
              geometry = geojson.geometry

          // Draw geojson of country if isoDisabled is equal to true
          this.view.drawGeojson(geometry);
        }.bind(this));
    },


    /**
     * ACTIONS
     * - deleteAnalysis
     * - notificate
     */
    publishAnalysis: function() {
      mps.publish('Analysis/delete');
    },

    deleteAnalysis: function() {
      this.status.set('iso', {
        country: null,
        region: null
      });
      this.status.set('isoDisabled', true);

      this.view.deleteGeojson();
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisCountryPresenter;

});
