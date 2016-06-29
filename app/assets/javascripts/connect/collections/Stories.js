define([
  'backbone', 'moment',
  'connect/models/Story'
], function(Backbone, moment, Story) {

  'use strict';

  var Stories = Backbone.Collection.extend({
    model: Story,

    //url: window.gfw.config.GFW_API_HOST_V2 + '/user/stories',
    url: 'http://api-gateway.globalforestwatch.dev:8000/story/user/57736ba451b9ca1300e39430',

    comparator: function(subscription) {
      return -moment(subscription.get('created')).unix();
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

  return Stories;

});
