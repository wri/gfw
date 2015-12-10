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
  'views/FeedbackModalView',
  'landing/views/SpinnerView',
  'landing/views/SlideView',
  'landing/views/StoriesView',
  'landing/views/FeedView',
  'landing/views/TwitterStyleView',
  'handlebars',
  '_string',
], function($, _, Class, Backbone, amplify, mps, HeaderView, FooterView, SourceWindowView, SourceMobileFriendlyView, FeedbackModalView, SpinnerView, SlideView, StoriesView, FeedView, TwitterStyleView, Handlebars) {
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
      new FeedbackModalView();

      //landing
      new SpinnerView();
      new SlideView();
      new StoriesView();
      new FeedView();
      new TwitterStyleView();

      // this.initSurvey();
    },

    initSurvey: function() {
      if (! !!amplify.store('survey_improve')) {
        amplify.store('survey_improve', true, { expires: 2628000000 });
        mps.publish('Source/open',['help_improve_GFW']);
      }
    }

  });

  new LandingPage();

});
