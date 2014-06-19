/**
 * Module for executing async HTTP requests.
 * 
 */
define([
  'jquery',
  'mps',
  'store'
], function ($, mps, store) {
  return {  

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

      if (cache && store.enabled) {
        val = store.get(url);
        if (val) {
          successCb(val);
        }
      }

      $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        success: function(response) {
          if (successCb) {
            if (cache && store.enabled) {
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
        dataType: 'json'
      });
      return jqxhr;
    }
  };
});