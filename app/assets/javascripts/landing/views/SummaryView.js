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

  var SummaryView = Backbone.View.extend({

    el: '.c-home-summary',

    events: {
      'click .js_summary_anchor' : '_onClickSummaryAnchor',
    },

    initialize: function() {
      this._initSlider();
    },

    _initSlider: function(){
      new SliderView({
        el: this.$el.find('.js_slider')
      });
    },

    _onClickSummaryAnchor: function () {
      $('html, body').animate({
        scrollTop: this.$el.offset().top
      }, 500);
    }

  });
  return SummaryView;

});