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
  return SwitchOptions;

});
