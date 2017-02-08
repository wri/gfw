/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'lory'
], function($, Backbone, _, lory) {

  'use strict';

  var SliderView = Backbone.View.extend({

    events: {
      'click .js_slide_prev' : '_onClickPrevSlide',
      'click .js_slide_next' : '_onClickNextSlide',
      'click .js_slider_dots li' : '_onClickDots',
    },

    options: {
      hiddenClass: '-hidden',
      dotsSelectedClass: '-selected'
    },

    initialize: function() {
      if (!this.el) {
        return;
      }

      this._cache();
      this._initSlider();
    },

    _cache: function() {
      this.$sliderItems = this.$el.find('.js_slide');
      this.$sliderPrev = this.$el.find('.js_slide_prev');
      this.$sliderNext = this.$el.find('.js_slide_next');
      this.$dots = this.$el.find('.js_slider_dots');
      this.$dotsItems = this.$dots.find('li');
    },

    _initSlider: function(){
      this.$el[0].addEventListener('after.lory.slide', this._handleSliderEvent.bind(this));
      this.$slider = lory.lory(this.$el[0], {
        enableMouseEvents: true,
      });
    },

    _handleSliderEvent: function() {
      this._checkButtonsVisibility();
      this._checkDots();
    },

    _checkButtonsVisibility: function() {
      var currentIndex = this.$slider.returnIndex();

      this.$sliderPrev.removeClass(this.options.hiddenClass);
      this.$sliderNext.removeClass(this.options.hiddenClass);
      if(currentIndex == 0) {
        this.$sliderPrev.addClass(this.options.hiddenClass);
      }
      if(currentIndex == this.$sliderItems.length - 2) {
        this.$sliderNext.addClass(this.options.hiddenClass);
      }
    },

    _checkDots: function() {
      var currentIndex = this.$slider.returnIndex();
      this.$dotsItems.removeClass(this.options.dotsSelectedClass);
      this.$el.find('.js_slider_dots li[data-index=' + currentIndex + ']').addClass(this.options.dotsSelectedClass);
    },

    _onClickPrevSlide: function() {
      this.$slider.prev();
    },

    _onClickNextSlide: function() {
      this.$slider.next();
    },

    _onClickDots: function(e) {
      this.$slider.slideTo($(e.currentTarget).data('index'));
    }

  });
  return SliderView;

});