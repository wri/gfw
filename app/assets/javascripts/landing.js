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
