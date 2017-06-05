define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'text!countries/templates/widgets/modals/snapshotTreeCoverModal.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  tpl) {

  'use strict';

  var SnapshotTreeCoverModal = Backbone.View.extend({
    el: 'body',

    events: {
      'click .js-open-snapshot-tree-cover-modal' : 'showModal',
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
      $('.-snapshot-tree-cover-modal').removeClass('-hidden');
    },

    closeModal: function() {
      $('.background-modal').addClass('-hidden')
      $('.-snapshot-tree-cover-modal').addClass('-hidden');
      $(this.el).removeClass('-relative');
    }
  });
  return SnapshotTreeCoverModal;

});
