define([
  'backbone',
  'connect/models/Subscription'
], function(Backbone, Subscription) {

  'use strict';

  var Subscriptions = Backbone.Collection.extend({
    model: Subscription,

    url: window.gfw.config.GFW_API_HOST + '/v2/subscriptions',

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

  return Subscriptions;

});
