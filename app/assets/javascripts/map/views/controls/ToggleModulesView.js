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
      if (!!hide && !!hide.hide) {
        this.$modulesToggle.addClass('hide');
      } else {
        this.$modulesToggle.removeClass('hide');
      }
    },

  });

  return ToggleModules;
});
