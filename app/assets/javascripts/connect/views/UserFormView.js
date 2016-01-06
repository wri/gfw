define([
  'backbone', 'handlebars',
  'map/models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Backbone, Handlebars, User, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form',

    events: {
      'click #sendform' : '_submit'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.loadFromCookie();

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
      this.$('form').submit();
    }
  });

  return UserFormView;

});
