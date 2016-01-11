define([
 'backbone'
], function(Backbone) {

  'use strict';

  var Subscription = Backbone.Model.extend({
    idAttribute: 'key',

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

  return Subscription;

});
