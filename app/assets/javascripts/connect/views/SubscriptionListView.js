/**
 * The UserFormView view.
 *
 * @return UserFormView instance (extends Backbone.View).
 */
define([
  'backbone',
  'handlebars',
  'mps',
  'text!connect/templates/subscriptionList.handlebars'
], function(Backbone, Handlebars, mps, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form',
    el: '.user-form',
    events: {
      'click #sendform' : '_submit',
      'click #skipform' : '_destroy'
    },

    template: Handlebars.compile(tpl),

    initialize: function(parent) {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({'action': window.gfw.config.GFW_API_HOST+'/user/setuser','redirect':window.location.href}));
    },

    _submit: function() {
      this.$el.find('form').submit();
    },

    _destroy: function() {

    }
  });

  return UserFormView;

});
