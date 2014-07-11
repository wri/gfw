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
  'services/PlaceService',
  'views/LayersNavView',
  'views/MapView',
  'views/LegendView',
  'views/SearchboxView',
  'views/MaptypeView',
  'views/TimelineView',
  'services/MapLayerService'
], function($, _, Backbone, mps, gmap, PlaceService, LayersNavView, MapView,
  LegendView, SearchboxView, MaptypeView, TimelineView, mapLayerService) {

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
      this.setWrapper();
      this.placeService = new PlaceService(mapLayerService, this);
      this.layersNavView = new LayersNavView();
      this.legendView = new LegendView();
      this.maptypeView = new MaptypeView();
      this.searchboxView = new SearchboxView();
      this.timelineView = new TimelineView();
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
