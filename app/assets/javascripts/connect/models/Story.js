define([
 'backbone'
], function(Backbone) {

  'use strict';

  var Story = Backbone.Model.extend({
    type: 'story',

    urlRoot: 'http://api-gateway.globalforestwatch.dev:8000/story',

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
      var attributes = response.attributes;
      attributes.id = response.id;

      return attributes;
    }
  });

  return Story;

});
