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
      this.listenTo(this.subscriptions, 'sync remove', this.render);
      this.subscriptions.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        subscriptions: this.subscriptions.toJSON()
      }));

      var sortedSubscriptions = new Subscriptions(
        this.subscriptions.sortBy(function(subscription) {
          return -moment(subscription.get('created')).unix();
        })
      );

      var $tableBody = this.$('#user-subscriptions-table-body');
      sortedSubscriptions.each(function(subscription) {
        var view = new SubscriptionListItemView({
          subscription: subscription});
        $tableBody.append(view.el);
      });
    }
  });

  return SubscriptionListView;

});
