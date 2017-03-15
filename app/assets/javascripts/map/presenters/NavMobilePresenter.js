/**
 * The NavMobilePresenter class for the NavMobilePresenter view.
 *º
 * @return NavMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'services/CountryService'
], function(_, mps, PresenterClass, CountryService) {

  'use strict';

  var NavMobilePresenter = PresenterClass.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        iso: null,

        analysis: false,
        analysisEnabled: true,
        analysisCurrent: false,

        timeline: false,
        timelineEnabled: true,

        layers: false
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      // Timeline
      this.status.on('change:timeline', this.changeTimeline.bind(this));
      this.status.on('change:timelineEnabled', this.changeTimelineEnabled.bind(this));

      // Analysis
      this.status.on('change:analysis', this.changeAnalysis.bind(this));
      this.status.on('change:analysisEnabled', this.changeAnalysisEnabled.bind(this));
      this.status.on('change:analysisCurrent', this.changeAnalysisCurrent.bind(this));

      // Analysis
      this.status.on('change:layers', this.changeLayers.bind(this));

      // Iso
      this.status.on('change:iso', this.changeIso.bind(this));
    },

    // /**
    //  * Application subscriptions. 'Analysis/visibility'
    //  */
    _subscriptions: [
      {
        'Place/go': function(place) {
          var params = place.params;

          if(!!params.iso.country && params.iso.country !== 'ALL'){
            this.status.set('iso', params.iso);
          }
        }

      },
      // TIMELINE
      {
        'Timeline/disabled' : function(){
          this.status.set('timelineEnabled', true);
        }
      },{
        'Timeline/enabled' : function(layerSlug){
          this.status.set('timelineEnabled', false);
        }
      },{
        'Timeline/toggle' : function(toggle){
          if (toggle) {
            this.status.set('analysis', false);
            this.status.set('layers', false);
          }
          this.status.set('timeline', toggle);
        }
      },

      // ANALYSIS
      {
        'Analysis/toggle': function(toggle) {
          if (toggle) {
            this.status.set('timeline', false);
            this.status.set('layers', false);
          }
          this.status.set('analysis', toggle);
        }
      },{
        'Analysis/enabled': function(enabled) {
          this.status.set('analysisEnabled', enabled);
        }
      },{
        'Analysis/results': function() {
          this.status.set('analysisCurrent', true);
        }
      },{
        'Analysis/results-error': function() {
          this.status.set('analysisCurrent', true);
        }
      },{
        'Analysis/delete': function(options) {
          this.status.set('analysisCurrent', false);
        }
      },

      // LAYERS
      {
        'Layers/toggle' : function(toggle){
          if (toggle) {
            this.status.set('analysis', false);
            this.status.set('timeline', false);
          }
          this.status.set('layers', toggle);
        }
      },

      // COUNTRY
      {
        'Country/update': function(iso) {
          this.status.set('iso', iso);
        }
      },

      // LEGEND
      {
        'LegendMobile/open' : function(toggle){
          mps.publish('Timeline/toggle', [false]);
          mps.publish('Analysis/toggle', [false]);
        }
      },

      // TABS
      {
        'Tab/closed' : function(){
          mps.publish('Timeline/toggle', [false]);
          mps.publish('Analysis/toggle', [false]);
        }
      },{
        'Overlay/toggle' : function(bool){
          if (!bool) {
            mps.publish('Timeline/toggle', [false]);
            mps.publish('Analysis/toggle', [false]);
          }
        }
      }
    ],


    /**
     * Change functions
     * - changeAnalysis
     * - changeAnalysisEnabled
     * - changeTimeline
     * - changeTimelineEnabled
     * - changeLayers
     * - changeIso
     */

    changeAnalysis: function() {
      mps.publish('Timeline/toggle', [false]);
      this.view.toogleAnalysis(this.status.get('analysis'));
    },

    changeAnalysisEnabled: function() {
      this.view.enableAnalysisBtn(this.status.get('analysisEnabled'));
    },

    changeAnalysisCurrent: function() {
      this.view.currentAnalysisBtn(this.status.get('analysisCurrent'));
    },

    changeTimeline: function() {
      mps.publish('Analysis/toggle', [false]);
      this.view.toogleTimeline(this.status.get('timeline'));
    },

    changeTimelineEnabled: function() {
      this.view.enableTimelineBtn(this.status.get('timelineEnabled'));
    },

    changeLayers: function() {
      mps.publish('Analysis/toggle', [false]);
      mps.publish('Timeline/toggle', [false]);
    },

    changeIso: function() {
      var iso = this.status.get('iso');

      if(!!iso && !!iso.country && iso.country !== 'ALL') {
        CountryService.showCountry({ iso: iso.country })
          .then(function(results) {
            this.view.toogleCountry(results.name);
          }.bind(this));
      } else {
        this.view.toogleCountry(null);
      }
    },

    toggleCurrentTab: function(tab, toggle){
      mps.publish(tab+'/toggle', [toggle]);
    },

    openCountriesTab: function(){
      mps.publish('Tab/open', ['#country-tab-mobile-btn', true]);
    }

  });

  return NavMobilePresenter;
});
