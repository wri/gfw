define([
  'jquery',
  'backbone',
  'underscore',
  'models/UserModel',
  'connect/views/UserFormView',
  'connect/views/StoriesListView',
  'connect/views/SubscriptionListView',
  'connect/views/SubscriptionNewView',
  'connect/views/LoginView',
  'connect/views/SubHeaderView',
  'views/NotificationsView',
  'views/SourceModalView'
], function($, Backbone, _, User, UserFormView, StoriesListView, SubscriptionListView, SubscriptionNewView, LoginView, SubHeaderView, NotificationsView, SourceModalView) {

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
      // 'subscriptions/new': 'subscriptionsNewPage',
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
      var view = new this.routeViews[page](this, this.user);
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

      new SourceModalView();
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
