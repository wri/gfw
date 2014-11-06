/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'landing/views/SlideView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, SlideView, DialogView) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      new SlideView();
    },


  });

  new LandingPage();

});
