define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _) {

  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'country/:iso': 'showCountry'
    },

    showCountry: function(iso) {
      console.log(iso);
    },

    startHistory: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({
          pushState: true
        });
      }
    }
  });

  return Router;

});
