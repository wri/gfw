/**
 * The router module.
 *
 * Router handles app routing and URL parameters and updates Presenter.
 *
 * @return singleton instance of Router class (extends Backbone.Router).
 */
define([
  'underscore',
  'backbone',
  'amplify',
  'map/utils',
  'map/services/PlaceService'
], function(_, Backbone, amplify, utils, PlaceService) {

  'use strict';

  var Router = Backbone.Router.extend({

    // temporary, we will do it with env variables
    _cacheVersion: 19,

    routes: {
      'map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'map',
      'embed/map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'embed'
    },

    /**
     * Boot file:
     *
     * @param  {[type]} boot [description]
     */
    initialize: function(mainView) {
      this.bind('all', this._checkForCacheBust());
      this.name = null;
      this.mainView = mainView;
      this.placeService = new PlaceService(this);
    },

    map: function() {
      this.name = 'map';
      this.mainView.setMapMode();
      this.initMap.apply(this, arguments);
    },

    embed: function() {
      this.name = 'embed/map';
      this.initMap.apply(this, arguments);
    },

    initMap: function(zoom, lat, lng, iso, maptype, baselayers, sublayers, subscribe) {
      var params = _.extend({
        zoom: zoom,
        lat: lat,
        lng: lng,
        iso: iso,
        maptype: maptype,
        baselayers: baselayers,
        sublayers: sublayers,
        subscribe_alerts: subscribe
      }, _.parseUrl());
      this.placeService.initPlace(this.name, params);
    },

    /**
     * If the URL contains the cache parameter (e.g., cache=bust), clear all
     * cached values in the browser (e.g., from memory, local storage,
     * session).
     */
    _checkForCacheBust: function() {
      var params = _.parseUrl();
      var localCacheVersion = _.toNumber(
        localStorage.getItem('CACHE_VERSION'));

      if (_.has(params, 'cache') || localCacheVersion !== this._cacheVersion) {
        _.each(amplify.store(), function(value, key) {
          amplify.store(key, null);
        });

        localStorage.setItem('CACHE_VERSION', this._cacheVersion);
      }
    },

    navigateTo: function(route, options) {
      this.navigate(route, options);
    }

  });

  return Router;

});
