define([
  'backbone', 'handlebars', 'moment',
  'text!connect/templates/subscriptionListItemDeleteConfirm.handlebars'
], function(Backbone, Handlebars, moment, tpl) {

  'use strict';

  var SubsciptionListItemDeleteConfirmView = Backbone.View.extend({
    events: {
      'click #confirm-delete': 'confirm',
      'click #cancel-delete': 'cancel',
      'click .modal-backdrop': 'cancel',
      'click .modal-close': 'cancel'
    },

    className: 'my-gfw-subscription-delete-modal',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;
    },

    render: function() {
      var subscription = this.subscription.toJSON();
      if (subscription.created !== undefined) {
        subscription.created = moment(subscription.created).
          format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template(subscription));

      return this;
    },

    cancel: function(event) {
      event.preventDefault();
      this.remove();
    },

    confirm: function(event) {
      event.preventDefault();

      this.trigger('confirmed');
      this.remove();
    }

  });

  return SubsciptionListItemDeleteConfirmView;

});
