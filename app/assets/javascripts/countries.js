require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'bluebird',
  'countries/router'
], function($, _, Class, Backbone, Promise, Router) {
  'use strict';

  var CountryPage = Class.extend({
    init: function() {
      this.router = new Router(this);
      this._configPromise();
      this._initApp();
    },

    _initApp: function() {
      this.router.startHistory()
    },

    _configPromise: function() {
      Promise.config({
        // Enable warnings
        warnings: false,
        // Enable long stack traces
        longStackTraces: true,
        // Enable cancellation
        cancellation: true,
        // Enable monitoring
        monitoring: true
      });
    }
  });

  new CountryPage();
});
