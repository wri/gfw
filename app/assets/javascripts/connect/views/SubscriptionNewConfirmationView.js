define([
  'backbone', 'handlebars',
  'text!connect/templates/subscriptionNewConfirm.handlebars'
], function(Backbone, Handlebars, tpl) {

  'use strict';

  var SubscriptionNewConfirmView = Backbone.View.extend({
    events: {
      'click #go-to-subscriptions': 'cancel',
      'click #go-to-open-data': 'goToContributeData',
      'click .modal-backdrop': 'cancel',
      'click .modal-close': 'cancel'
    },

    className: 'my-gfw-subscription-confirmation-modal',

    template: Handlebars.compile(tpl),

    render: function(params) {
      this.$el.html(this.template(params));
      return this;
    },

    cancel: function(event) {
      event.preventDefault();
      this.remove();
    },

    goToContributeData: function(event) {
      event.preventDefault();

      this.remove();
      window.location.href = '/contribute-data';
    }

  });

  return SubscriptionNewConfirmView;

});
