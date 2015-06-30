/**
 * The MapControlsMobilePresenter class for the MapControlsMobilePresenter view.
 *º
 * @return MapControlsMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var MapControlsMobilePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'AnalysisMobile/open': function() {
        this.view.toogleAnalysisBtn($('#analysis-tab').hasClass('is-analysis'));
      }
    },{
      'AnalysisResults/Delete': function() {
        this.view.toogleAnalysisBtn(false);
      }
    },{
      'LocalMode/updateIso' : function(iso,analyze){
        this.view.toogleCountryBtn(iso);
      }
    },{
      'Timeline/toggle' : function(toggle){
        this.view.toogleTimeline(toggle);
      }
    }],

    openLegend: function() {
      mps.publish('LegendMobile/open');
    },

    openAnalysis: function(){
      mps.publish('AnalysisMobile/open');
    },

    openCountriesTab: function(){
      mps.publish('Tab/open', ['#country-tab-mobile-btn', true]);
    }

  });

  return MapControlsMobilePresenter;
});
