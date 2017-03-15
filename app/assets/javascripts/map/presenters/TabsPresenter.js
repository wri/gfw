/**
 * The TabsPresenter class for the TabsPresenter view.
 *º
 * @return TabsPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'enquire',
  'map/presenters/PresenterClass'
], function(_, Backbone, mps, enquire, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      tab: 'analysis-tab',
      iso: null,
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
        var iso = place.params.iso;
        var button = '#'+tab+'-button';
        this.status.set('tab', tab);
        this.status.set('iso', iso);
        this.view.openTab(button, null);
      }
    },{
      'Tab/open': function(id, backbutton) {
        this.view.openTab(id, backbutton);
      }
    },{
      'Tab/toggle': function(id, active) {
        this.view.toggleTab(id, active);
      }
    },{
      'Layers/toggle': function(toggle) {
        this.view.toggleMobileLayers(toggle);
      }
    },{
      'Country/update': function(iso) {
        this.status.set('iso', iso);
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

    publishIso: function(iso) {
      mps.publish('Country/update', [iso]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current tab value.
     *
     * @return {Object} tab
     */
    getPlaceParams: function() {
      var p = {};
      p.tab = this.status.get('tab');
      p.iso = this.status.get('iso');
      return p;
    },



  });

  return TabsPresenter;
});
