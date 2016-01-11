define([
  'backbone', 'handlebars',
  'map/models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Backbone, Handlebars, User, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form content-form',

    events: {
      'click #submit' : '_submit'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        action: window.gfw.config.GFW_API_HOST+'/user',
        redirect: window.location.href,
        user: this.user.toJSON()
      }));
    },

    _submit: function() {
      var formValues = this.$('form').
        serializeArray().
        reduce(function(prev, curr) {
          prev[curr.name] = curr.value;
          return prev;
        }, {});

      this.user.set(formValues);
      this.user.save();
    }
  });

  return UserFormView;

});
