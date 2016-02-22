/**
 * The SubscribePresenter class for the SubscribePresenter view.
 *
 * @return SubscribePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var SubscribePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
      mps.publish('Place/register', [this]);
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Subscribe/show': function(options) {
        this.view.show(options);
      }
    }, {
      'Subscribe/hide': function() {
        this.view.close();
      }
    },{
      'Subscribe/geom': function(geom) {
        this.geom_for_subscription = geom;
      }
    }],

    subscribeEnd: function(){
      mps.publish('Subscribe/end');
    },

    updateUrl: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    setSubscribeState: function() {
      this.subscribe = true;
      this.updateUrl();
    },

    unSetSubscribeState: function() {
      delete this.subscribe;
      this.updateUrl();
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      p.subscribe = this.subscribe;

      return p;
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    }

  });

  return SubscribePresenter;
});
