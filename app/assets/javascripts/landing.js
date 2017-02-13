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
  'landing/views/NewsView',
], function(
  $,
  _,
  Class,
  Backbone,
  SummaryView,
  UseExamplesView,
  NewsView
) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      new SummaryView();
      new UseExamplesView();
      new NewsView();
    },

  });

  new LandingPage();

});
