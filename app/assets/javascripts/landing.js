/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, utils, mps, DialogView) {

  'use strict';

  var MapPage = Class.extend({

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
     * CAUTION: Don't change the order of initanciations if
     * you are not completely sure.
     */
    _initViews: function() {

    },


  });

  new MapPage();

});
