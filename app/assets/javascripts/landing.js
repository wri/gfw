/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'amplify',
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


  'landing/views/SummaryView'
], function(
  $,
  _,
  Class,
  Backbone,
  amplify,
  mps,
  SummaryView
) {

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
      new SummaryView();
    },

  });

  new LandingPage();

});
