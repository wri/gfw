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
      'click .js-icon-cross-close' : 'closeModal',
      'click .js-done-btn-annual' : 'doneModal',
    },

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.$el.append(this.template({
        years: params.years,
        thresh: params.thresh,
        datasets: params.datasets,
      }));
    },

    showModal: function() {
      $(this.el).addClass('-relative');
      $('.background-modal').removeClass('-hidden');
      $('.-tree-cover-loss-modal').removeClass('-hidden');
    },

    closeModal: function() {
      $('.background-modal').addClass('-hidden')
      $('.-tree-cover-loss-modal').addClass('-hidden');
      $(this.el).removeClass('-relative');
    },

    doneModal: function() {
      this.trigger('updateDataModal');
      this.closeModal();
    }
  });
  return TreeCoverLossModal;

});
