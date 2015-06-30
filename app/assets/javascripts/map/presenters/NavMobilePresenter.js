/**
 * The NavMobilePresenter class for the NavMobilePresenter view.
 *º
 * @return NavMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var NavMobilePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
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
      'Analysis/toggle': function() {
        this.view.toogleTimelineClass(false);
        this.view.toogleAnalysisBtn($('#analysis-tab').hasClass('is-analysis'));
      }
    },{
      'AnalysisResults/Delete': function() {
        this.view.toogleAnalysisBtn(false);
      }
    },{
      'Countries/name': function(name,bool) {
        this.view.toogleCountryBtn(name,bool);
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
    toggleCurrentTab: function(tab, toggle){
      mps.publish(tab+'/toggle', [toggle]);
    },

    openCountriesTab: function(){
      mps.publish('Tab/open', ['#country-tab-mobile-btn', true]);
    }

  });

  return NavMobilePresenter;
});
