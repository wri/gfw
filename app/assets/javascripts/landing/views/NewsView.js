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

  var NewsView = Backbone.View.extend({

    el: '.c-home-news',

    initialize: function() {
      this._initSlider();
    },

    _initSlider: function(){
      new SliderView({
        el: this.$el.find('.js_slider')
      });
    },

  });
  return NewsView;

});