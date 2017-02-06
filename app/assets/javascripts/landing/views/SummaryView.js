/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'lory'
], function($, Backbone, _, mps, lory) {

  'use strict';

  var SummaryView = Backbone.View.extend({

    el: '.c-home-summary',

    events: {
      'click .js_slide_prev' : '_onClickPrevSlide',
      'click .js_slide_next' : '_onClickNextSlide'
    },

    initialize: function() {
      this._cache();
      this._initSlider();
    },

    _cache: function() {
      this.$slider = this.$el.find('.js_slider');
      this.$dots = this.$el.find('.js_slider_dots')
    },

    _initSlider: function(){
      this.$slider[0].addEventListener('before.lory.init', this._handleDotEvent.bind(this));
      this.$slider[0].addEventListener('after.lory.init', this._handleDotEvent.bind(this));
      this.$slider[0].addEventListener('after.lory.slide', this._handleDotEvent.bind(this));
      this.$slider[0].addEventListener('on.lory.resize', this._handleDotEvent.bind(this));
      this.$slider = lory.lory(this.$slider[0], {
        enableMouseEvents: true
      });
    },

    _handleDotEvent: function (e) {
      console.log(e.type);
      if (e.type === 'after.lory.slide') {

      }
      if (e.type === 'on.lory.resize') {

      }
    },

    _onClickPrevSlide: function (e) {
      this.$slider.prev();
    },

    _onClickNextSlide: function (e) {
      this.$slider.next();
    }

  });
  return SummaryView;

});