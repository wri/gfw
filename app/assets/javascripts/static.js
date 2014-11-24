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
  'views/TermsView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, HeaderView, FooterView, TermsView, DialogView) {
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
      //shared
      new HeaderView();
      new FooterView();
      new TermsView();
      //static

    }
  });

  new LandingPage();

});
