define(['handlebars', 'underscore'], function(Handlebars, _) {

  'use strict';

  var helpers = {
    truncate: function (str, len) {
      if (str && str.length > len && str.length > 0) {
        var new_str = str + ' ';
        new_str = str.substr (0, len);
        new_str = str.substr (0, new_str.lastIndexOf(' '));
        new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

        return new Handlebars.SafeString ( new_str +'...' ); 
      }

      return str;
    }
  };

  var register = function() {
    _.each(helpers, function(method, methodName) {
      Handlebars.registerHelper(methodName, method);
    });
  };

  return {register: register};

});
