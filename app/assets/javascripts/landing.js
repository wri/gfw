/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'landing/views/CoverView',
  'landing/views/SummaryView',
  'landing/views/UseExamplesView',
  'landing/views/AppsView',
  'landing/views/NewsView',
], function(
  $,
  _,
  Class,
  Backbone,
  CoverView,
  SummaryView,
  UseExamplesView,
  AppsView,
  NewsView
) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      new CoverView();
      new SummaryView();
      new UseExamplesView();
      new AppsView();
      new NewsView();
    },

  });

  new LandingPage();

});
