define([
  'jquery',
  'mps'
], function ($, mps) {
  return {  

    /**
     * Executes an RPC asynchronously.
     * 
     * Args:
     *   url: The URL endpoint
     *   data: Object with parameters.
     *   callback: Object with a success and error function.
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