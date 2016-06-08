/**
 * Application entry point.
 */
require([
  'jquery',
  'Class',
  'backbone',
  'static-pages/views/SmallGrantsFundView',
], function($, Class, Backbone, SmallGrantsFundView) {

  'use strict';

  var StaticPage = Class.extend({

    $el: $('body'),

    init: function() {
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
      new SmallGrantsFundView();
    }

  });

  new StaticPage();

});
