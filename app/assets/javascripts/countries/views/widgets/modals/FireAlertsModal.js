define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'text!countries/templates/widgets/modals/fireAlertsModal.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  tpl) {

  'use strict';

  var FireAlertsModal = Backbone.View.extend({
    el: 'body',

    events: {
      'click .js-open-fire-alerts-modal' : 'showModal',
      'click .background-modal' : 'closeModal',
      'click .js-icon-cross-close' : 'closeModal',
    },

    template: Handlebars.compile(tpl),

    showModal: function() {
      $(this.el).addClass('-relative');
      this.$el.append(this.template());
    },

    closeModal: function() {
      $('.background-modal').remove();
      $('.m-modal-country').remove();
    }
  });
  return FireAlertsModal;

});
