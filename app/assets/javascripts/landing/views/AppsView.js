/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'enquire',
  'landing/views/SliderView'
], function($, Backbone, _, enquire, SliderView) {

  'use strict';

  var AppsView = Backbone.View.extend({

    el: '.c-home-applications',

    events: {
      'click .js_slide_prev': '_onClickPrevSlide',
      'click .js_slide_next': '_onClickNextSlide',
      'click .js-home-applications-linker': '_onClickApp'
    },

    options: {
      sliderButtonDefaultMargin: 14,
      sliderButtonAnimateMargin: -36,
      sliderButtonAnimateTime: 300
    },

    initialize: function() {
      this._cache();
      this._initSlider();
    },

    _cache: function () {
      enquire.register("screen and (min-width: 768px)", {
        match: function() {
          this.options.sliderButtonDefaultMargin = 18;
        }.bind(this)
      });
    },

    _initSlider: function(){
      this.slider = new SliderView({
        el: this.$el.find('.js_slider'),
        sliderOptions: {
          infinite: 1,
          slideSpeed: 1000
        }
      });
    },

    _onClickPrevSlide: function() {
      this.slider.$slider.prev();
    },

    _onClickNextSlide: function() {
      this.slider.$slider.next();
    },

    _onClickApp: function (e) {
      var trackLabel = $(e.currentTarget).closest('li').data('section');
      ga('send', 'event', 'Home', 'Click app', trackLabel);
    },

  });
  return AppsView;

});