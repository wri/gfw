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

    toggleModules: function(){
      this.$modulesToggle.toggleClass('hide');
    },

  });

  return ToggleModules;
});
