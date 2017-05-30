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
      'click .js-switch-option' : 'switchOption',
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.$el.append(this.template());
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

    switchOption: function(e) {
      var $parent = $(e.target).parent();
      var disabledOption = $(e.target).hasClass('disabled');
      if (!disabledOption) {
        _.each($parent.find('.js-switch-option'), function(option) {
          var $option = $(option);
          var optionSelected = $option.hasClass('active');
          if (optionSelected) {
            $option.removeClass('active');
          }
        });
        $(e.target).addClass('active');
      }
    }
  });
  return TreeCoverLossModal;

});
