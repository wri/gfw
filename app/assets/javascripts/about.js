/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone'
], function(
  $,
  _,
  Class,
  Backbone
) {

  'use strict';

  var AboutPage = Class.extend({

    $el: $('body'),

    init: function() {
    },

  });

  new AboutPage();

});
