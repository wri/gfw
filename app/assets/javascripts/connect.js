require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'chosen',
  'map/utils',
  'mps',
  'bluebird',
  'handlebars',
  'connect/router',
], function($, _, Class, Backbone, chosen, utils, mps, Promise, Handlebars, Router) {

  'use strict';

  var ConnectPage = Class.extend({

    init: function() {
      this.router = new Router(this);
      this._cartodbHack();
      this._handlebarsPlugins();
      this._googleMapsHelper();
      this._configPromise();
      this._initApp();
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      this.router.startHistory()
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

    _handlebarsPlugins: function() {
      Handlebars.registerHelper('firstLetter', function(text) {
        return text.charAt(0).toUpperCase();
      });

      Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      });
    },

    _googleMapsHelper: function() {
      if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function() {
          var bounds = new google.maps.LatLngBounds();
          var paths = this.getPaths();
          var path;
          for (var i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            for (var ii = 0; ii < path.getLength(); ii++) {
              bounds.extend(path.getAt(ii));
            }
          }
          return bounds;
        }
      }
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

  new ConnectPage();
});
