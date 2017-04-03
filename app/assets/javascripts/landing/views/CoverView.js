/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
], function($, Backbone, _) {

  'use strict';

  var CoverView = Backbone.View.extend({

    el: '.c-home-cover',

    events: {
      'click .js_summary_anchor' : '_onClickSummaryAnchor',
    },

    initialize: function () {
      this._cache();
      this._onScrollCheckAnchorVisibility();
    },

    _cache: function () {
      this.$summaryAnchor = this.$el.find('.js_summary_anchor');
    },

    _onClickSummaryAnchor: function () {
      $('html, body').animate({
        scrollTop: $('.c-home-summary').offset().top
      }, 500);
    },

    _onScrollCheckAnchorVisibility: function () {
      $(window).on('scroll', this._checkAnchorVisibility.bind(this));
    },

    _checkAnchorVisibility: function () {
      var heightLimit = $(window).height() / 4;
      if ($(window).scrollTop() >= heightLimit) {
        this.$summaryAnchor.fadeOut();
        $(window).off('scroll', this._checkAnchorVisibility.bind(this));
      }
    },

  });
  return CoverView;

});