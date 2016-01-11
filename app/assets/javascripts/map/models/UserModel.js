define([
 'backbone'
], function(Backbone) {

  'use strict';

  var User = Backbone.Model.extend({
    url: window.gfw.config.GFW_API_HOST + '/user',

    sync: function(method, model, options) {
      options || (options = {});

      if (!options.crossDomain) {
        options.crossDomain = true;
      }

      if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
      }

      return Backbone.sync.call(this, method, model, options);
    }
  });

  return User;

});
