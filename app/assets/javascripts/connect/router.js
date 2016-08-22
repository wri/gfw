define([
  'jquery',
  'backbone',
  'underscore',
  'map/models/UserModel',
], function(
  $, Backbone, _,
  User,
  UserFormView, StoriesListView, SubscriptionListView, LoginView,
  NotificationsView) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      '': 'myProfilePage',
      'subscriptions': 'mySubscriptionsPage',
      'stories': 'myStoriesPage'
    },

    initialize: function() {
      // this.placeService = new PlaceService(this);
    },

    // This function is from Backbone and it will be executed everytime a route change
    execute: function(callback, args, name) {
      if (!this.alreadyLoggedIn) {
        this.isLoggedIn().then(function() {
          if (callback) { 
            callback.apply(this, args); 
          }
          this.alreadyLoggedIn = true;
        }.bind(this)).fail(function() {
          callback.apply(this, args);
        }.bind(this));
      } else {
        if (callback) { 
          callback.apply(this, args); 
        }
      }
    },


    /**
     * HELPERS
     * -isLoggedIn
     */
    isLoggedIn: function() {
      this.user = new User();
      return this.user.fetch();
    },

    navigateTo: function(route, options) {
      this.navigate(route, options);
    }

  });

  return Router;

});



// /**
//  * The router module.
//  *
//  * Router handles app routing and URL parameters and updates Presenter.
//  *
//  * @return singleton instance of Router class (extends Backbone.Router).
//  */
// define([
//   'underscore',
//   'backbone',
//   'amplify',
//   'map/utils',
//   'map/services/PlaceService'
// ], function(_, Backbone, amplify, utils, PlaceService) {

//   'use strict';

//   var Router = Backbone.Router.extend({

//     routes: {
//       '': 'profilePage',
//       // 'map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'map',
//       // 'embed/map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'embed'
//     },

//     /**
//      * Boot file:
//      *
//      * @param  {[type]} boot [description]
//      */
//     initialize: function(mainView) {
//       this.isLocalStorageNameSupported();
//       this.name = null;
//       this.mainView = mainView;
//       this.placeService = new PlaceService(this);

//     },

//     map: function() {
//       this.name = 'map';
//       this.initMap.apply(this, arguments);
//     },

//     embed: function() {
//       this.name = 'embed/map';
//       this.initMap.apply(this, arguments);
//     },

//     initMap: function(zoom, lat, lng, iso, maptype, baselayers, sublayers, subscribe, referral) {
//       var params = _.extend({
//         zoom: zoom,
//         lat: lat,
//         lng: lng,
//         iso: iso,
//         maptype: maptype,
//         baselayers: baselayers,
//         sublayers: sublayers,
//         subscribe_alerts: subscribe,
//         referral: referral
//       }, _.parseUrl());
      
//       this.placeService.initPlace(this.name, params);
//     },

//     navigateTo: function(route, options) {
//       this.navigate(route, options);
//     }

//   });

//   return Router;

// });

