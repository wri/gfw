define([
  'jquery', 'backbone', 'underscore',
  'map/models/UserModel',
  'connect/views/UserFormView',
  'connect/views/SubscriptionListView'
], function($, Backbone, _, User, UserFormView, SubscriptionListView) {

  'use strict';

  var UserRouter = Backbone.Router.extend({

    el: $('#profile'),

    routes: {
      '*path': 'showView'
    },

    initialize: function() {
      this.checkLoggedIn();
      this.setupNavbar();
    },

    checkLoggedIn: function() {
      this.user = new User();
      this.user.fetch().fail(function() {
        location.href = '/';
      });
    },

    setupNavbar: function() {
      // Force nav links to navigate, rather than doing a browser page
      // reload
      var context = this;
      $('#user-profile-nav').on('click', 'a', function(event) {
        event.preventDefault();
        var root = location.protocol + '//' + location.host + '/',
            href = _.last($(this).prop('href').split(root));

        context.navigate(href, {trigger: true});
      });
    },

    availableViews: {
      'my_gfw': UserFormView,
      'subscriptions': SubscriptionListView
    },

    showView: function(routeName) {
      var viewName = _.last(_.compact(routeName.split('/')));

      this.subViews = this.subViews || {};
      if (this.subViews[viewName] === undefined) {
        var View = this.availableViews[viewName];
        if (View === undefined) { return; }

        this.subViews[viewName] = new View();
        this.subViews[viewName].render();
      }

      this.el.html(this.subViews[viewName].el);
      this.subViews[viewName].delegateEvents();
    }

  });

  return UserRouter;

});
