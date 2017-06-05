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

    initialize: function() {
      this.$el.append(this.template());
    },

    showModal: function() {
      $(this.el).addClass('-relative');
      $('.background-modal').removeClass('-hidden');
      $('.-fire-alerts-modal').removeClass('-hidden');
    },

    closeModal: function() {
      $('.background-modal').addClass('-hidden')
      $('.-fire-alerts-modal').addClass('-hidden');
      $(this.el).removeClass('-relative');
    }
  });
  return FireAlertsModal;

});
