/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'landing/views/SliderView'
], function($, Backbone, _, SliderView) {

  'use strict';

  var UseExamplesView = Backbone.View.extend({

    el: '.c-home-use-examples',

    initialize: function() {
      this._initSliders();
    },

    _initSliders: function(){
      new SliderView({
        el: this.$el.find('.c-home-use-examples__users.js_slider')
      });
      _.each($('.c-home-use-examples__testimonials.js_slider'), function(element) {
        new SliderView({
          el: $(element)
        });
      });
    },

  });
  return UseExamplesView;

});