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
    _cacheVersion: window.gfw.cacheVersion,


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
      this.isLocalStorageNameSupported();
      this.bind('all', this._checkForCacheBust());
      this.name = null;
      this.mainView = mainView;
      this.placeService = new PlaceService(this);

    },

    map: function() {
      this.name = 'map';
      this.initMap.apply(this, arguments);
    },

    embed: function() {
      this.name = 'embed/map';
      this.initMap.apply(this, arguments);
    },

    initMap: function(zoom, lat, lng, iso, maptype, baselayers, sublayers, subscribe, referral, lang) {
      var params = _.extend({
        zoom: zoom,
        lat: lat,
        lng: lng,
        iso: iso,
        maptype: maptype,
        baselayers: baselayers,
        sublayers: sublayers,
        subscribe_alerts: subscribe,
        referral: referral,
        lang: lang
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
      var localCacheVersion = _.toNumber(localStorage.getItem('CACHE_VERSION'));

      if (_.has(params, 'cache') || localCacheVersion !== _.toNumber(this._cacheVersion)) {
        _.each(amplify.store(), function(value, key) {
          amplify.store(key, null);
        });

        localStorage.setItem('CACHE_VERSION', this._cacheVersion);
      }
    },

    isLocalStorageNameSupported: function() {
      // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
      // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
      // to avoid the entire page breaking, without having to do a check at each usage of Storage.
      if (typeof localStorage === 'object') {
        try {
          localStorage.setItem('localStorage', 1);
          localStorage.removeItem('localStorage');
        } catch (e) {
          Storage.prototype._setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function() {};
          alert('You may not be able to experience full functionality of the map while in private mode because your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode".');
        }
      }
    },

    navigateTo: function(route, options) {
      this.navigate(route, options);
    }

  });

  return Router;

});
