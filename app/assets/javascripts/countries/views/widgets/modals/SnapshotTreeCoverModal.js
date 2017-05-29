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
  return SnapshotTreeCoverModal;

});
