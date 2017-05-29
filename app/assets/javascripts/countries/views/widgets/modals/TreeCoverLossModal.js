define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'text!countries/templates/widgets/modals/treeCoverLossModal.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  tpl) {

  'use strict';

  var TreeCoverLossModal = Backbone.View.extend({
    el: 'body',

    events: {
      'click .js-open-tree-cover-loss-modal' : 'showModal',
      'click .background-modal' : 'closeModal',
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
  return TreeCoverLossModal;

});
