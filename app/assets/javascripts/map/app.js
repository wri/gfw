/**
 * The application module.
 * 
 * @return singleton instance of App class.
 */
define([
  'Class'
], function (Class) {

  var App = Class.extend({
    init: function() {
      console.log('App.initialize()');
    }
  });

  var app = new App();

  

  return app;
});