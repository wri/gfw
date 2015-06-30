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
    }],

    toggleCurrentTab: function(tab, toggle){
      mps.publish(tab+'/toggle', [toggle]);
    }

  });

  return NavMobilePresenter;
});
