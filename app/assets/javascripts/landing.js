/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'landing/views/SummaryView',
  'landing/views/UseExamplesView',
], function(
  $,
  _,
  Class,
  Backbone,
  SummaryView,
  UseExamplesView
) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      new SummaryView();
      new UseExamplesView();
    },

  });

  new LandingPage();

});
