/**
 * The router module.
 *
 * Router handles app routing and URL parameters and updates Presenter.
 *
 * @return singleton instance of Router class (extends Backbone.Router).
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'mps',
  'gmap',
  'amplify',
  'services/PlaceService',
  'views/LayersNavView',
  'views/MapView',
  'views/LegendView',
  'views/ThresholdView',
  'views/SearchboxView',
  'views/MaptypeView',
  'views/TimelineView',
  'services/MapLayerService'
], function($, _, Backbone, mps, gmap, amplify, PlaceService, LayersNavView, MapView, LegendView,
    ThresholdView, SearchboxView, MaptypeView, TimelineView, mapLayerService) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      'map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'map',
    },

    initialize: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        if (place.route) {
          this.navigate('map/' + this.route, {silent: true});
        }
      }, this));
      this.bind( 'all', this._checkForCacheBust());
      this.setWrapper();

      // Init general views
      this.placeService = new PlaceService(mapLayerService, this);
      this.layersNavView = new LayersNavView();

      // Init widgets
      this.legendView = new LegendView();
      this.maptypeView = new MaptypeView();
      this.searchboxView = new SearchboxView();
      this.ThresholdView = new ThresholdView();
      this.timelineView = new TimelineView();
    },

    /**
     * If the URL contains the cache parameter (e.g., cache=bust), clear all
     * cached values in the browser (e.g., from memory, local storage,
     * session).
     */
    _checkForCacheBust: function() {
      var params = _.parseUrl();

      if (_.has(params, 'cache')) {
        _.each(amplify.store(), function(value, key) {
          amplify.store(key, null);
        });
      }
    },

    map: function(zoom, lat, lng, iso, maptype, baselayers, sublayers) {
      var pathParams = {
        zoom: zoom,
        lat: lat,
        lng: lng,
        iso: iso,
        maptype: maptype,
        baselayers: baselayers,
        sublayers: sublayers
      };
      var queryParams = _.parseUrl();
      var params = _.extend(pathParams, queryParams);

      gmap.init(_.bind(function() {
        if (!this.mapView) {
          this.mapView = new MapView();
        }
        mps.publish('Place/update', [{go: true, name: 'map', params: params}]);
      }, this));
    },

    setWrapper: function() {
      var $logo = $('.header-nav__logo');
      var setScroll = function(e) {
        var element = (e) ? e.currentTarget : window;
        if (element.pageYOffset > 10) {
          $logo.addClass('is-fixed');
        } else {
          $logo.removeClass('is-fixed');
        }
      };
      setScroll();
      $(window).on('scroll', setScroll);
      $('html, body').scrollTop(70);
    }

  });

  var router = new Router();

  return router;

});
