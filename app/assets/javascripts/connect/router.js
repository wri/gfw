define([
  'jquery',
  'backbone',
  'underscore',
  'map/models/UserModel',
  'connect/views/UserFormView',
  'connect/views/StoriesListView',
  'connect/views/SubscriptionListView',
  'connect/views/SubscriptionNewView',
  'connect/views/LoginView',
  'connect/views/SubHeaderView',
  'views/NotificationsView'
], function($, Backbone, _, User, UserFormView, StoriesListView, SubscriptionListView, SubscriptionNewView, LoginView, SubHeaderView, NotificationsView) {

  'use strict';

  var Router = Backbone.Router.extend({

    $el: $('.my-gfw-container'),

    status: new (Backbone.Model.extend({
      page: null,
      views: []
    })),

    routes: {
      '': 'profilePage',
      'login': 'loginPage',
      'stories': 'storiesPage',
      'subscriptions': 'subscriptionsPage',
      'subscriptions/new': 'subscriptionsNewPage',
    },

    routeViews: {
      'login': LoginView,
      'profile': UserFormView,
      'stories': StoriesListView,
      'subscriptions': SubscriptionListView,
      'subscriptions/new': SubscriptionNewView,
    },

    initialize: function() {
      this.initCommonViews();
      this.listeners();
      // this.placeService = new PlaceService(this);
    },

    listeners: function() {
      this.status.on('change:page', this.changePage.bind(this));
    },

    navigateTo: function(route, options) {
      this.navigate(route, options);
    },

    // This function is from Backbone and it will be executed everytime a route change
    execute: function(callback, args, name) {
      if (!this.alreadyLoggedIn) {
        this.user = new User();
        this.user.fetch()
          .then(function() {
            if (callback) {
              callback.apply(this, args);
            }
            this.alreadyLoggedIn = true;
          }.bind(this))

          .fail(function() {
            this.loginPage();
          }.bind(this));

      } else {
        if (callback) {
          callback.apply(this, args);
        }
      }
    },

    /**
     * CHANGES
     * - changePage
     */
    changePage: function() {
      var page = this.status.get('page');

      // Set active
      this.subHeaderView.setPage(page);

      // Remove existing views
      _.each(this.status.get('views'), function(view){
        view.remove();
      }.bind(this));

      // Add new view
      var view = new this.routeViews[page]();
      this.$el.html(view.el);
      view.delegateEvents();

      if (view.show !== undefined) {
        view.show();
      }
    },


    /**
     * ROUTE PAGES
     * - profilePage
     * - subscriptionsPage
     * - storiesPage
     * - loginPage
     */
    initCommonViews: function() {
      this.subHeaderView = new SubHeaderView({
        el: '#my-gfw-profile-nav',
        router: this
      });

      new NotificationsView();
    },

    profilePage: function() {
      this.status.set('page','profile');
    },

    storiesPage: function() {
      this.status.set('page','stories');
    },

    loginPage: function() {
      this.status.set('page','login');
    },

    subscriptionsPage: function() {
      this.status.set('page','subscriptions');
    },

    subscriptionsNewPage: function() {
      this.status.set('page','subscriptions/new');
    },

    /**
     * HELPERS
     * -isLogged
     */
    isLogged: function() {
      console.log(this.user.get('id'));
    },

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
