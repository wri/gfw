/**
 * Module for executing async HTTP requests.
 *
 */
define([
  'Class',
  'mps',
  'store'
], function (Class, mps, store) {

  'use strict';

  var NSA = Class.extend({

    // Added for Jasmine testing to bypass cache and use 'json' dataType
    test: false,

    init: function() {
      mps.subscribe('LocalStorage/clear', function() {
        store.clear();
        console.log('LocalStorage cleared');
      });
    },

    /**
     * Async HTTP request to supplied URL and optional data.
     *
     * @param  {string} url The URL.
     * @param  {object} data The URL query parameters.
     * @param  {function} successCb The success callback function.
     * @param  {function} errorCb The error callback function
     * @return {object} The jqXHR object handle.
     */
    spy: function(url, data, successCb, errorCb, cache) {
      var jqxhr = null;
      var val = null;
      var dataType = url.contains('cartodb.com') ? 'jsonp' : 'json';

      cache = cache === undefined ? true : cache;

      if (!this.test && cache && store.enabled) {
        // TODO: Key should be made from url+data
        val = store.get(url);
        if (val) {
          successCb(val);
          return;
        }
      }

      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        success: function(response) {
          if (successCb) {
            if (!this.test && cache && store.enabled) {
              store.set(url, response);
            }
            successCb(response);
          }
        },
        error: function(jqxhr, status, error) {
          if (errorCb) {
            errorCb(jqxhr.responseText, status, error);
          }
        },
        contentType: 'application/json',
        dataType: this.test ? 'json' : dataType
      });
      return jqxhr;
    }
  });

  var nsa = new NSA();

  return nsa;
});
