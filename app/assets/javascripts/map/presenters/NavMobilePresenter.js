/**
 * The NavMobilePresenter class for the NavMobilePresenter view.
 *º
 * @return NavMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/CountryService'  
], function(_, mps, PresenterClass, countryService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      iso: null
    }
  });


  var NavMobilePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
      this.status = new StatusModel();

      this.listeners();      
    },

    listeners: function() {
      this.status.on('change:iso', this.changeIso.bind(this));
    },

    // /**
    //  * Application subscriptions. 'Analysis/visibility'
    //  */
    _subscriptions: [{
      'Timeline/disabled' : function(){
        this.view.toggleTimelineBtn(true);
      }
    },{
      'Timeline/enabled' : function(layerSlug){
        this.view.toggleTimelineBtn(false);
      }
    },{
      'Tab/closed' : function(){
        this.view.resetBtns();
      }
    },{
      'Overlay/toggle' : function(bool){
        if (!bool)
          this.view.resetBtns();
      }
    },{
      'Analysis/toggle': function(boolean) {
        this.view.toogleTimelineClass(false);
        this.view.toogleAnalysisBtn($('#analysis-tab').hasClass('is-analysis'));        
      }
    },{
      'Analysis/visibility': function(to) {
        this.view.toggleVisibilityAnalysis(to);
      }
    },{
      'AnalysisResults/Delete': function() {
        this.view.toogleAnalysisBtn(false);
      }
    },{
      'Country/update': function(iso) {
        this.status.set('iso', iso);
      }
    },{
      'Timeline/toggle' : function(toggle){
        this.view.toogleTimelineClass(toggle);
      }
    },{
      'Layers/toggle' : function(toggle){
        this.view.toogleTimelineClass(false);
      }
    },{
      'LegendMobile/open' : function(toggle){
        this.view.toogleTimelineClass(false);
      }
    }],
    
    changeIso: function() {
      var iso = this.status.get('iso');

      if(!!iso && !!iso.country && iso.country !== 'ALL'){
        countryService.show(iso.country, _.bind(function(results) {
          this.view.toogleCountryBtn(results.name);
        },this));
      } else {
        this.view.toogleCountryBtn(null);
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
