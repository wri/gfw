/**
 * The ToggleModules module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'map/presenters/controls/ToggleModulesPresenter'
], function(_, Backbone, Handlebars, Presenter) {

  'use strict';

  var ToggleModules = Backbone.View.extend({

    initialize: function() {
      this.presenter = new Presenter(this);
      this.$modulesToggle = $('.module-toggle');
    },

    toggleModules: function(hide) {
      this.$modulesToggle.each(function(i, el) {
        var $el = $(el);

        // check the element hasn't been hidden because there is no layer ON.
        if ($el.hasClass('hide-no-layers')) return;

        if (!!hide && !!hide.hide) {
          $el.addClass('hide');
        } else {
          $el.removeClass('hide');
        }
      })
    },

  });

  return ToggleModules;
});
