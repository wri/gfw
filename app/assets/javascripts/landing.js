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
  'landing/views/FooterView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, SpinnerView, SlideView, StoriesView, FooterView, DialogView) {
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
      //spinner
      new SpinnerView();
      //landing
      new SlideView();
      new StoriesView();

      //footer
      new FooterView();
    }
  });

  new LandingPage();

});