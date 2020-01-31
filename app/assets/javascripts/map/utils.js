define([
	'underscore'
], function (_) {

	'use strict';

	if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    };
  }

  // Returns true if string contains substring.
  if (!String.prototype.contains) {
    String.prototype.contains = function(substr) {
      return this.indexOf(substr) > -1;
    };
  }

  _.mixin({
    parseUrl: function() {
      var e;
      // Regex for replacing addition symbol with a space
      var a = /\+/g;
      var r = /([^&=]+)=?([^&]*)/g;
      var d = function(s) {
        return decodeURIComponent(s.replace(a, ' '));
      };
      var q = window.location.search.substring(1);
      var urlParams = {};

      // Parses URL parameters:
      while ((e = r.exec(q))) {
        urlParams[d(e[1])] = d(e[2]);
      }

      return urlParams;
    },

    toNumber: function(val) {
      if ((val === undefined || val === null || String(val).trim() === '')) {
        return undefined;
      } else if (isNaN(val)) {
        return undefined;
      } else {
        return Number(val);
      }
    },

    extendNonNull: function(obj) {
      _.each(_.rest(arguments,1), function(source) {
        if (source) {
          for (var prop in source) {
            if( _.isObject(source[prop]) && _.isObject(obj[prop])){
               obj[prop] = _.extendNonNull(obj[prop], source[prop]);
            }
            else if( !_.isNull(source[prop])){
               obj[prop] = source[prop];
            }
          }
        }
      });
      return obj;
    }
  });

});
