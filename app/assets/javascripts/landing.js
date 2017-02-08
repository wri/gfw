/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'landing/views/SummaryView'
], function(
  $,
  _,
  Class,
  Backbone,
  SummaryView
) {

  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      new SummaryView();
    },

  });

  new LandingPage();

});
