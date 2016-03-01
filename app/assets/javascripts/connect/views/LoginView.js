define([
  'backbone', 'handlebars',
  'text!connect/templates/login.handlebars'
], function(Backbone, Handlebars, tpl) {

  'use strict';

  var LoginView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'click .my-gfw-login-modal-close': 'close',
      'click .my-gfw-login-modal-backdrop': 'close'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        apiHost: window.gfw.config.GFW_API_HOST
      }));

      return this;
    }

  });

  return LoginView;

});
