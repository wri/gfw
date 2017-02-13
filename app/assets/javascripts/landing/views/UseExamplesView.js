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

    events: {
      'click .c-home-use-examples__users .js_slide' : '_onClickUser'
    },

    options: {
      selectedClass: '-selected',
    },

    loadedFilters: [0],

    initialize: function() {
      this._initVisibleSliders();
    },

    _initVisibleSliders: function () {
      new SliderView({
        el: this.$el.find('.c-home-use-examples__users.js_slider')
      });
      new SliderView({
        el: this.$el.find('.c-home-use-examples__testimonials.js_slider.' + this.options.selectedClass)
      });
    },

    _initSlider: function (index) {
      new SliderView({
        el: this.$el.find('.c-home-use-examples__testimonials.js_slider[data-index="' + index + '"]')
      });
    },

    _onClickUser: function (e) {
      var index = $(e.currentTarget).data('index');

      this._switchTestimonials(index);
      if(this.loadedFilters.indexOf(index) == -1) {
        this._initSlider(index);
        this.loadedFilters.push(index);
      }
    },

    _switchTestimonials: function (index) {
      $('.c-home-use-examples__avatar.' + this.options.selectedClass).removeClass(this.options.selectedClass);
      $('.c-home-use-examples__testimonials.' + this.options.selectedClass).removeClass(this.options.selectedClass);

      $('.c-home-use-examples__users [data-index="' + index + '"] .c-home-use-examples__avatar').addClass(this.options.selectedClass);
      $('.c-home-use-examples__testimonials[data-index="' + index + '"]').addClass(this.options.selectedClass);
    }

  });
  return UseExamplesView;

});