/**
 * Module for executing async HTTP requests.
 * 
 */
define([
  'jquery',
  'mps'
], function ($, mps) {
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
    spy: function(url, data, successCb, errorCb) {
      var jqxhr = null;
      var key = null;
      var val = null;

      $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        success: function(response) {
          if (successCb) {
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