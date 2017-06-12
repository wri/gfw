define([
  'jquery',
  'backbone',
  'underscore',
  'urijs/URI',
  'countries/views/CountryListView',
  'countries/views/CountryOverviewView',
  'countries/views/CountryShowView',
  'countries/views/CountryWidgetDispatcherView'
], function($, Backbone, _, URI, CountryListView, CountryOverviewView, CountryShowView, CountryWidgetDispatcherView) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      'countries': 'showList',
      'countries/overview': 'showOverview',
      'countries/:iso(/)': 'showCountry',
      'countries/:iso(/):region(/)': 'showCountryRegion',
      'embed/country_widget/:widget/:iso(/)': 'showWidget',
      'embed/country_widget/:widget/:iso(/):region(/)': 'showWidget'
    },

    showList: function() {
      new CountryListView();
    },

    showOverview: function() {
      new CountryOverviewView();
    },

    showCountry: function(iso, region) {
      this.iso = iso;
      this.region = region;

      this.countryShow = new CountryShowView({
        iso: iso,
        region: 0
      });

      this.listenTo(
         this.countryShow ,
         'updateUrl',
         this.updateUrl
      );
    },

    showCountryRegion: function(iso, region) {
      this.iso = iso;
      this.region = region;
      this.routerChange = region != 0 ? true : false;
      this.countryShow = new CountryShowView({
        iso: iso,
        region: region
      });

      this.listenTo(
         this.countryShow ,
         'updateUrl',
         this.updateUrl
      );
    },

    startHistory: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({
          pushState: true
        });
      }
    },

    updateUrl: function() {
      var region = $('#areaSelector').val();
      var uri = new URI();
      if(region != 0 ){
        if(this.routerChange) {
          this.navigate(uri.path().slice(0, uri.path().lastIndexOf('/')) +'/'+region);
        } else {
          this.navigate(uri.path().slice(0, uri.path().lastIndexOf('/')) +'/'+this.iso+'/'+region);
          this.routerChange = true;
        }
      } else {
        this.routerChange = false;
        this.navigate(uri.path().slice(0, uri.path().lastIndexOf('/')));
      }
    },

    showWidget: function (widget, iso, region) {
      new CountryWidgetDispatcherView({
        widget: widget,
        iso: iso,
        region: region
      });
    },
  });

  return Router;

});
