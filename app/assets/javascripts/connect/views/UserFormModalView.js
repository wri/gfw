define([
  'backbone', 'handlebars',
  'map/models/UserModel',
  'connect/views/UserFormView',
  'text!connect/templates/userFormModal.handlebars'
], function(Backbone, Handlebars, User, UserFormView, tpl) {

  'use strict';

  var UserFormModalView = Backbone.View.extend({

    className: 'my-gfw-profile-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .my-gfw-profile-modal-close': 'close',
      'click .my-gfw-profile-modal-backdrop': 'close'
    },

    initialize: function() {
      this.render();

      this.user = new User();
      this.listenTo(this.user, 'sync', this.showIfNewUser);
      this.user.fetch();
    },

    render: function() {
      this.$el.html(this.template());

      var userForm = new UserFormView({ isModal: true });
      this.listenTo(userForm, 'saved', this.close);
      this.$('.my-gfw-profile-modal-content').html(userForm.el);

      return this;
    },

    showIfNewUser: function() {
      if (this.user.get('is_new')) {
        this.render();
        this.show();
      }
    },

    show: function() {
      this.$el.addClass('is-active');
    },

    close: function(event) {
      if (event !== undefined && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.$el.removeClass('is-active');
      this.render();

      this.user.set('is_new', false);
      this.user.save();
    }

  });

  return UserFormModalView;

});
