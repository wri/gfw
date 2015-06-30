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
      'Timeline/toggle' : function(toggle){
        this.view.toogleTimeline(toggle);
      }
    }, {
      'Layers/toggle': function(toggle) {
        this.view.toogleTimeline(false);
      }
    }, {
      'Analysis/toggle': function(toggle) {
        this.view.toogleTimeline(false);
      }
    }],

    openLegend: function() {
      mps.publish('LegendMobile/open');
    },

    openAnalysis: function(){
      mps.publish('Analysis/toggle');
    },

    openCountriesTab: function(){
      mps.publish('Tab/open', ['#country-tab-mobile-btn', true]);
    }

  });

  return MapControlsMobilePresenter;
});
