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
  'views/SourceWindowView',
  'views/SourceMobileFriendlyView',
  'landing/views/SpinnerView',
  'landing/views/SlideView',
  'landing/views/StoriesView',
  'landing/views/FeedView',
  'landing/views/TwitterStyleView',
  'handlebars',
  '_string',
], function($, _, Class, Backbone, mps, HeaderView, FooterView, SourceWindowView, SourceMobileFriendlyView, SpinnerView, SlideView, StoriesView, FeedView, TwitterStyleView, Handlebars) {
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
      new SourceWindowView();
      new SourceMobileFriendlyView();

      //landing
      new SpinnerView();
      new SlideView();
      new StoriesView();
      new FeedView();
      new TwitterStyleView();
    }
  });

  new LandingPage();

});
