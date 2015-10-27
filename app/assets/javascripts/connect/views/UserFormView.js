/**
 * The UserFormView view.
 *
 * @return UserFormView instance (extends Backbone.View).
 */
define([
  'backbone',
  'handlebars',
  'mps',
  'text!connect/templates/userForm.handlebars'
], function(Backbone, Handlebars, mps, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form',
    el: '.user-form',

    template: Handlebars.compile(tpl),

    initialize: function(parent) {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
    }
  });

  return UserFormView;

});
