/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'static/RouterStatic',
  'static/CarrouselView',
  'static/StoriesKeepView',
  'static/VideoView',
  'static/SearchView',
  'static/FeedbackView',
  'static/ApplicationsNavView',
  'views/HeaderView',
  'views/FooterView',
  'views/TermsView',
  'views/DialogView',
  'views/SidebarNavView',
  'views/InterestingView',
  'views/SourceMobileFriendlyView',

  '_string'
], function($, _, Class, Backbone, mps, RouterStatic, CarrouselView, StoriesKeepView, VideoView, SearchView, FeedbackView, ApplicationsNavView, HeaderView, FooterView, TermsView, DialogView, SidebarNavView, InterestingView, SourceMobileFriendlyView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new RouterStatic();

      this._initViews();
      this._initApp();
      this._youtubeApi();
    },

    _youtubeApi: function(){
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = _.bind(function(){
        mps.publish('YoutubeAPI/ready');
      },this)
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      new RouterStatic();
      //shared
      new HeaderView();
      new FooterView();
      new TermsView();
      new SourceMobileFriendlyView();
      //static
      new SidebarNavView();
      new CarrouselView();
      new InterestingView();
      new StoriesKeepView();
      new VideoView();
      new SearchView();
      new FeedbackView();
      new ApplicationsNavView();
    }
  });

  new LandingPage();

});
