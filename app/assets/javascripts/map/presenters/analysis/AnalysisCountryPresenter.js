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

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment) {

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
      this.status.on('change:isoEnabled', this.changeIsoEnabled.bind(this));

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
          
          this.status.set('iso', {
            country: params.iso.country,
            region: params.iso.region
          });

          this.status.set('isoEnabled', ! !!params.dont_analyze);          
        }
      },
      
      // GLOBAL ANALYSIS EVENTS
      {
        'Analysis/delete': function() {
          this.status.set('iso', {
            country: null,
            region: null
          });
          this.status.set('isoEnabled', false);
        }
      },{
        'Analysis/enabled': function(enabled) {
          this.status.set('enabled', enabled);
        }
      },{
        'Analysis/enabled-subscription': function(enabled) {
          this.status.set('enabledSubscription', enabled);
        }
      }
    ],

    /**
     * LISTENERS
     */
    changeIso: function() {
      this.view.toggleEnabledButtons();
      mps.publish('Analysis/iso', [this.status.get('iso')])
    },

    changeIsoEnabled: function() {
      mps.publish('Analysis/isoEnabled', [this.status.get('isoEnabled')])
    },

    changeEnabled: function() {
      this.view.toggleEnabledButtons();
    },

    changeEnabledSubscription: function() {
      this.view.toggleEnabledButtons();
    },


    /**
     * ACTIONS
     * - deleteAnalysis
     * - notificate
     */
    deleteAnalysis: function() {
      mps.publish('Analysis/delete');
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisCountryPresenter;

});
