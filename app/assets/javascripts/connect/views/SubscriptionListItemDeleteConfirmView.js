define([
  'backbone', 'handlebars',
  'text!connect/templates/subscriptionListItemDeleteConfirm.handlebars'
], function(Backbone, Handlebars, tpl) {

  'use strict';

  var SubsciptionListItemDeleteConfirmView = Backbone.View.extend({
    events: {
      'click #confirm-delete': 'confirm',
      'click #cancel-delete': 'cancel'
    },

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;
    },

    render: function() {
      this.$el.html(this.template(
        this.subscription.toJSON()));

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
