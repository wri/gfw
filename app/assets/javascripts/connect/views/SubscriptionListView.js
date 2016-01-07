define([
  'backbone', 'handlebars', 'moment',
  'connect/collections/Subscriptions',
  'connect/views/SubscriptionListItemView',
  'text!connect/templates/subscriptionList.handlebars'
], function(Backbone, Handlebars, moment, Subscriptions, SubscriptionListItemView, tpl) {

  'use strict';

  var SubscriptionListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),

    initialize: function() {
      this.subscriptions = new Subscriptions();
      this.listenTo(this.subscriptions, 'sync', this.render);
      this.subscriptions.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      var $tableBody = this.$('#user-subscriptions-table-body');
      this.subscriptions.each(function(subscription) {
        var view = new SubscriptionListItemView({
          subscription: subscription});
        $tableBody.append(view.el);
      });
    }
  });

  return SubscriptionListView;

});
