/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'stories/handlebarsHelpers',
  'static/RouterStatic',
  'static/CarrouselView',
  'static/VideoView',
  'static/SearchView',
  'static/FeedbackView',
  'static/ApplicationsNavView',
  'static/ApplicationsGridView',
  'static/ApplicationsModalView',
  'static/ContributeDataView',
  'static/GalleryView',
  'static/ContactUsView',
  'views/HeaderView',
  'views/FooterView',
  'views/SidebarNavView',
  'views/InterestingView',
  'views/SourceMobileFriendlyView',
  'views/NotificationsView',
  '_string'
], function($, _, Class, Backbone, mps, handlebarsHelpers, RouterStatic, CarrouselView, VideoView, SearchView, FeedbackView, ApplicationsNavView, ApplicationsGridView, ApplicationsModalView, ContributeDataView,
            GalleryView, ContactUsView, HeaderView, FooterView, SidebarNavView, InterestingView, SourceMobileFriendlyView, NotificationsView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {

      handlebarsHelpers.register();

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
      new SourceMobileFriendlyView();

      //static
      new SidebarNavView();
      new CarrouselView();
      new InterestingView();
      new VideoView();
      new SearchView();
      new FeedbackView();
      new ApplicationsNavView();
      new ApplicationsGridView();
      new ApplicationsModalView();
      new ContributeDataView();
      new GalleryView();
      new ContactUsView();
      new NotificationsView();
    }
  });

  new LandingPage();

});
