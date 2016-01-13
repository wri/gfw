/**
 * The TabsPresenter class for the TabsPresenter view.
 *º
 * @return TabsPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'map/presenters/PresenterClass'
], function(_, Backbone, mps, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      tab: 'countries-tab'
    }
  });

  var TabsPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          mps.publish('Place/register', [this]);
        },this)
      });
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Place/go': function(place) {
        var tab = place.params.tab || this.status.get('tab');
        var button = '#'+tab+'-button';
        this.status.set('tab', tab);
        this.view.openTab(button, null);
      }
    },{
      'Tab/open': function(id, backbutton) {
        this.view.openTab(id, backbutton);
      }
    },{
      'Layers/toggle': function(toggle) {
        this.view.toggleMobileLayers(toggle);
      }
    }],

    onTabOpen: function(id){
      this.status.set('tab', id);
      mps.publish('Tab/opened', [id]);
      mps.publish('Place/update', [{go: false}]);
    },

    onTabMobileClose : function () {
      mps.publish('Tab/closed');
    },

    /**
     * Used by PlaceService to get the current tab value.
     *
     * @return {Object} tab
     */
    getPlaceParams: function() {
      var p = {};
      p.tab = this.status.get('tab');
      return p;
    },



  });

  return TabsPresenter;
});
