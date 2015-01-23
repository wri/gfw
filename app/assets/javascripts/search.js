/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  '_string'
], function($, _, Class, Backbone, mps) {

  'use strict';

  var SearchPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
    }
  });

  new SearchPage();

});
