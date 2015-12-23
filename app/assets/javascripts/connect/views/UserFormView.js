/**
 * The UserFormView view.
 *
 * @return UserFormView instance (extends Backbone.View).
 */
define([
  'backbone',
  'handlebars',
  'mps',
  'text!connect/templates/userForm.handlebars',
  'text!connect/templates/subscriptionList.handlebars'
], function(Backbone, Handlebars, mps, tpl_form, tpl_list) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form',
    el: '#my-gfw',
    events: {
      'click #sendform' : '_submit',
      'click #skipform' : '_destroy',
      'click .tabs h3'  : '_toggleTab'
    },

    template_form: Handlebars.compile(tpl_form),
    template_list: Handlebars.compile(tpl_list),

    initialize: function(parent) {
      this.render();
      this.cachevars();
    },

    render: function() {
      this.$el.find('.user-form').html(this.template_form({'action': window.gfw.config.GFW_API_HOST+'/user/setuser','redirect':window.location.href}));
      this.$el.find('.subscription-list').html(this.template_list());
    },

    cachevars: function() {
      this.$tabs           = this.$el.find('.tabs h3');
      this.$content_form   = this.$el.find('.content-form');
      this.$tabs_contents  = this.$content_form.find('.tab-content');
    },

    _submit: function() {
      this.$el.find('form').submit();
    },

    _destroy: function() {

    },

    _toggleTab: function(e) {
      var $ev = $(e.target);
      if ($ev.hasClass('current')) return;

      this.$tabs_contents.hide();
      $('#activate-'+ $ev.data('tab')).show();

      this.$tabs.removeClass('current');
      $ev.addClass('current');
    }
  });

  return UserFormView;

});
