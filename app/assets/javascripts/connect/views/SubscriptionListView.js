define([
  'backbone', 'handlebars', 'moment',
  'text!connect/templates/subscriptionList.handlebars'
], function(Backbone, Handlebars, moment, tpl) {

  'use strict';

  var getCookie = function(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) { return parts.pop().split(';').shift(); }
  };

  var Subscriptions = Backbone.Collection.extend({

    url: window.gfw.config.GFW_API_HOST + '/v2/subscriptions',

    loadFromCookie: function() {
      var authCookie = getCookie('_eauth');

      if (authCookie !== undefined) {
        this.fetch({ xhrFields: { withCredentials: true } });
      }
    }
  });

  var SubscriptionListView = Backbone.View.extend({
    className: 'user-form',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.subscriptions = new Subscriptions();
      this.listenTo(this.subscriptions, 'sync', this.render);
      this.subscriptions.loadFromCookie();

      this.render();
    },

    render: function() {
      var subscriptions = this.subscriptions.toJSON();
      subscriptions = subscriptions.map(function(subscription) {
        if (subscription.created !== undefined) {
          subscription.created = moment(subscription.created).
            format('dddd, YYYY-MM-D, h:mm a');
        }

        subscription.params.geom = JSON.stringify(subscription.params.geom);

        return subscription;
      });

      this.$el.html(this.template({
        subscriptions: subscriptions
      }));
    }
  });

  return SubscriptionListView;

});
