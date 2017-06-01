define([
  'jquery',
  'backbone',
  'underscore',
  'countries/views/CountryListView',
  'countries/views/CountryOverviewView',
  'countries/views/CountryShowView'
], function($, Backbone, _, CountryListView, CountryOverviewView, CountryShowView) {

  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'countries': 'showList',
      'countries/overview': 'showOverview',
      'countries/:iso(/):region(/)': 'showCountry'
    },

    showList: function() {
      new CountryListView();
    },

    showOverview: function() {
      new CountryOverviewView();
    },

    showCountry: function(iso, region) {
      new CountryShowView({
        iso: iso,
        region: region
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
