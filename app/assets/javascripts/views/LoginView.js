/**
 * The LoginView selector view.
 *
 * @return LoginView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'text!templates/login.handlebars'
], function(_, Handlebars, mps, tpl) {

  'use strict';

  var LoginView = Backbone.View.extend({
    className: 'login-modal mini-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .overlay' : 'hide',
      'click .close' : 'hide'
    },

    initialize: function(parent) {
      //it's initialize by HeaderView calling directly to login
    },

    login: function(event) {
      event && event.preventDefault() && event.stopPropagation();
      this.$el.show(0);
      this.render();
      return this;
    },

    hide: function(e) {
      e && e.preventDefault();

      if (this.iframeView !== undefined) {
        this.iframeView.hide();
      }

      this.remove();
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  return LoginView;

});
