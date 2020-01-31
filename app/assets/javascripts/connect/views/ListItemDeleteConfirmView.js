define([
  'backbone', 'handlebars', 'moment',
  'text!connect/templates/listItemDeleteConfirm.handlebars'
], function(Backbone, Handlebars, moment, tpl) {

  'use strict';

  var ListItemDeleteConfirmView = Backbone.View.extend({
    events: {
      'click #confirm-delete': 'confirm',
      'click #cancel-delete': 'cancel',
      'click .modal-backdrop': 'cancel',
      'click .modal-close': 'cancel'
    },

    className: 'my-gfw-subscription-delete-modal',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.model = options.model;
    },

    render: function() {
      var model = this.model.toJSON();
      if (model.createdAt !== undefined) {
        model.createdAt = moment(model.createdAt).
          format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template({
        model: model,
        type: this.model.type
      }));

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

  return ListItemDeleteConfirmView;

});
