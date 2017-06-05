define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate
  ) {

  'use strict';

  var SwitchOptions = Backbone.View.extend({
    el: 'body',

    events: {
      'click .js-switch-option' : 'switchOption',
    },

    switchOption: function(e) {
      var $parent = $(e.target).parent();
      var disabledOption = $(e.target).hasClass('disabled');
      if (!disabledOption) {
        $parent.find('.js-switch-option').each(function(index, option) {
          var optionSelected = $(option).hasClass('active');
          if (optionSelected) {
            $(option).removeClass('active');
            if ($parent.hasClass('options-modal-cover-loss-alerts')) {
              if ($(option).hasClass('data-source-filter-modal-loss-alerts')) {
                $(option).removeClass('data-source-filter-modal-loss-alerts');
              }
            }
          }
        });
        $(e.target).addClass('active');
        if ($parent.hasClass('options-modal-cover-loss-alerts')) {
          $(e.target).addClass('data-source-filter-modal-loss-alerts');
        }
      }
    }
  });
  return SwitchOptions;

});
