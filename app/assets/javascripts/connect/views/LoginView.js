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

    initialize: function(options) {
      options = options || {};
      this.message = options.message;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        apiHost: window.gfw.config.GFW_API,
        message: this.message
      }));

      return this;
    }

  });

  return LoginView;

});
