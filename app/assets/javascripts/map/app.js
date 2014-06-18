/**
 * The application module.
 * 
 * @return singleton instance of App class.
 */
define([
  'underscore',
  'mps',
  'router',  // So that routes are setup before starting history!
  'Class'
], function (_, mps, router, Class) {

  var App = Class.extend({
    init: function() {
      console.log('App.initialize()');
    }
  });

  var app = new App();

  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  }

  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });

  _.mixin({
    parseUrl: function() {
      var a = /\+/g;  // Regex for replacing addition symbol with a space
      var r = /([^&=]+)=?([^&]*)/g;
      var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
      var q = window.location.search.substring(1);
      var urlParams = {};
      
      // Parses URL parameters:
      while ((e = r.exec(q))) {
        urlParams[d(e[1])] = d(e[2]);
      }

      return urlParams;
    }
  });

  return app;
});