define([
  'jquery',
  'backbone',
  'underscore',
  'countries/views/CountryShowView'
], function($, Backbone, _, CountryShowView) {

  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'countries/:iso': 'showCountry'
    },

    showCountry: function(iso) {
      new CountryShowView({
        iso: iso
      });
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
