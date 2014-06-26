/**
 * The application module.
 *
 * @return singleton instance of App class.
 */
define([
  'Class'
], function (Class) {
  'use strict';

  var App = Class.extend({
    init: function() {
      console.log('App.initialize()');
    }
  });

  var app = new App();

  return app;
});
