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

  var NewsView = Backbone.View.extend({

    el: '.c-home-applications',

    events: {
      'click .js_slide_prev' : '_onClickPrevSlide',
      'click .js_slide_next' : '_onClickNextSlide',
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
      this.$prevButton = this.$el.find('.js_slide_prev');
      this.$nextButton = this.$el.find('.js_slide_next');

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
          infinite: 1
        },
        afterSlideCallback: this._afterSlide.bind(this)
      });
    },

    _onClickPrevSlide: function() {
      this.slider.$slider.prev();
    },

    _onClickNextSlide: function() {
      this.slider.$slider.next();
    },

    _afterSlide: function () {
      var currentSlide = this.slider.$el.find('.js_slide.active');
      var prevSlide = currentSlide.prev();
      var nextSlide = currentSlide.next();

      this._updateSliderButtons(prevSlide.data('section'), nextSlide.data('section'), this.slider.lastSlideDirection);
    },

    _updateSliderButtons: function (prevKey, nextKey, direction) {
      if(direction === 'next') {
        this.$prevButton.append('<li>' + this._getSliderButtonIconHTML(prevKey) + '</li>');
        this.$nextButton.append('<li>' + this._getSliderButtonIconHTML(nextKey) + '</li>');

        this.$prevButton.children().first().animate({
          marginLeft: this.options.sliderButtonAnimateMargin
        }, this.options.sliderButtonAnimateTime, function() {
          this.remove();
        });

        this.$nextButton.children().first().animate({
          marginLeft: this.options.sliderButtonAnimateMargin
        }, this.options.sliderButtonAnimateTime, function() {
          this.remove();
        });
      } else {
        this.$prevButton
          .prepend('<li>' + this._getSliderButtonIconHTML(prevKey) + '</li>')
          .children().first().css("margin-left", this.options.sliderButtonAnimateMargin);
        this.$nextButton
          .prepend('<li>' + this._getSliderButtonIconHTML(nextKey) + '</li>')
          .children().first().css("margin-left", this.options.sliderButtonAnimateMargin);

        this.$prevButton.children().first().animate({
          marginLeft: this.options.sliderButtonDefaultMargin
        }, this.options.sliderButtonAnimateTime, function() {
          this.$prevButton.children().last().remove();
        }.bind(this));

        this.$nextButton.children().first().animate({
          marginLeft: this.options.sliderButtonDefaultMargin
        }, this.options.sliderButtonAnimateTime, function() {
          this.$nextButton.children().last().remove();
        }.bind(this));
      }
    },

    _getSliderButtonIconHTML: function (key) {
      return '<svg class="icon"><use xlink:href="#icon-app-' + key + '"></use></svg>';
    }

  });
  return NewsView;

});