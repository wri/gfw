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
  'landing/views/FooterView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, SlideView, FooterView, DialogView) {
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
      new FooterView();
    },


  });

  new LandingPage();

});
