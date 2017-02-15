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
  'landing/views/AppsView',
  'landing/views/NewsView',
], function(
  $,
  _,
  Class,
  Backbone,
  SummaryView,
  UseExamplesView,
  AppsView,
  NewsView
) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      new SummaryView();
      new UseExamplesView();
      new AppsView();
      new NewsView();
    },

  });

  new LandingPage();

});
