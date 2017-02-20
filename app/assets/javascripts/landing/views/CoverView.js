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

    _onClickSummaryAnchor: function () {
      $('html, body').animate({
        scrollTop: $('.c-home-summary').offset().top
      }, 500);
    }

  });
  return CoverView;

});