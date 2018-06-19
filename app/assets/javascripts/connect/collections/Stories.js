define([
  'backbone', 'moment',
  'connect/models/Story'
], function(Backbone, moment, Story) {

  'use strict';

  var Stories = Backbone.Collection.extend({
    model: Story,

    url: window.gfw.config.GFW_API + '/user/stories',

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
