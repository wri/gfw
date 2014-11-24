/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'views/HeaderView',
  'views/FooterView',
  'landing/views/SpinnerView',
  'landing/views/SlideView',
  'landing/views/StoriesView',
  'landing/views/FeedView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, HeaderView, FooterView, SpinnerView, SlideView, StoriesView,FeedView, DialogView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Landing Views.
     */
    _initViews: function() {
      //shared
      new HeaderView();
      new FooterView();
      new SpinnerView();

      //landing
      //new SlideView();
      new StoriesView();
      new FeedView();
    }
  });

  new LandingPage();

});
