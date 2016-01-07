define([
  'jquery', 'backbone',
  'connect/views/UserFormView',
  'connect/views/SubscriptionListView'
], function($, Backbone, UserFormView, SubscriptionListView) {

  'use strict';

  var UserRouter = Backbone.Router.extend({

    el: $('#profile'),

    routes: {
      '*path': 'showView'
    },

    availableViews: {
      'my_gfw': UserFormView,
      'my_gfw/subscriptions': SubscriptionListView
    },

    showView: function(viewName) {
      this.subViews = this.subViews || {};
      if (this.subViews[viewName] === undefined) {
        this.subViews[viewName] = new this.availableViews[viewName]();
        this.subViews[viewName].render();
      }

      this.el.html(this.subViews[viewName].el);
      this.subViews[viewName].delegateEvents();
    }

  });

  return UserRouter;

});
