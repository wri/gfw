/**
 * Module for executing async HTTP requests.
 *
 */
define([
  'jquery',
  'mps',
  'store'
], function ($, mps, store) {

  'use strict';

  return {

    // Added for Jasmine testing to bypass cache and use 'json' dataType
    test: false,

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

      if (!this.test && cache && store.enabled) {
        // TODO: Key should be made from url+data
        val = store.get(url);
        if (val) {
          successCb(val);
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
  };
});
