/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'landing/views/SpinnerView',
  'landing/views/SlideView',
  'landing/views/StoriesView',
  'landing/views/HeaderView',
  'landing/views/FooterView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, SpinnerView, SlideView, StoriesView, HeaderView, FooterView, DialogView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      //shared
      new HeaderView();
      new FooterView();
      //new SpinnerView();

      //landing
      new SlideView();
      new StoriesView();
    }
  });

  new LandingPage();

});
