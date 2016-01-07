define([
  'jquery', 'backbone', 'underscore',
  'connect/views/UserFormView',
  'connect/views/SubscriptionListView'
], function($, Backbone, _, UserFormView, SubscriptionListView) {

  'use strict';

  var UserRouter = Backbone.Router.extend({

    el: $('#profile'),

    routes: {
      '*path': 'showView'
    },

    availableViews: {
      'my_gfw': UserFormView,
      'subscriptions': SubscriptionListView
    },

    showView: function(routeName) {
      var viewName = _.last(_.compact(routeName.split('/')));

      this.subViews = this.subViews || {};
      if (this.subViews[viewName] === undefined) {
        var view = this.availableViews[viewName];
        if (view === undefined) { return; }

        this.subViews[viewName] = new view();
        this.subViews[viewName].render();
      }

      this.el.html(this.subViews[viewName].el);
      this.subViews[viewName].delegateEvents();
    }

  });

  return UserRouter;

});
