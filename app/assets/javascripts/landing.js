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
  'landing/views/StoriesView',
  'landing/views/FeedView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, HeaderView, FooterView, SpinnerView, StoriesView,FeedView, DialogView) {
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
      new StoriesView();
      new FeedView();
    }
  });

  new LandingPage();

});
