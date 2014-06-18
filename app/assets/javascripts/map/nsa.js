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
    spy: function(url, data, success, error) {
      var jqxhr = null;
      var key = null;
      var val = null;

      $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        success: function(response) {
          if (success) {
            success(response);
          }
        },
        error: function(status, msg) {
          if (error) {
            error(status, msg);
          }
        },
        contentType: 'application/json', 
        dataType: 'json'
      });
      return jqxhr;
    }
  };
});