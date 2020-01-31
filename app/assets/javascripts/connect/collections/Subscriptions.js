define([
  'backbone',
  'moment',
  'connect/models/Subscription'
], function(Backbone, moment, Subscription) {

  'use strict';

  var Subscriptions = Backbone.Collection.extend({
    model: Subscription,

    url: window.gfw.config.GFW_API + '/subscriptions',

    comparator: function(subscription) {
      return -moment(subscription.get('createdAt')).unix()
    },

    sync: function(method, model, options) {
      options || (options = {});

      if (!options.crossDomain) {
        options.crossDomain = true;
      }

      if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
      }

      return Backbone.sync.call(this, method, model, options);
    },

    parse: function(response) {
      return response.data;
    }

  });

  return Subscriptions;

});
