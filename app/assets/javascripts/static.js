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
  'views/HeaderView',
  'views/FooterView',
  'views/TermsView',
  'views/DialogView',
  'views/SidebarNavView',
  'landing/views/StoriesView',
  '_string'
], function($, _, Class, Backbone, mps, RouterStatic, HeaderView, FooterView, TermsView, DialogView, SidebarNavView, StoriesView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new RouterStatic();

      this._initViews();
      this._initApp();      
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
      //static
      new SidebarNavView();
      new StoriesView()
    }
  });

  new LandingPage();

});
