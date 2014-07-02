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
  'services/MapLayerService'
], function($, _, Backbone, mps, gmap, PlaceService, LayersNavView, MapView, mapLayerService) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      'map': 'map',
      'map/:zoom/:lat/:lng/:iso/:maptype/:baselayers(/:sublayers)(/)': 'map',
    },

    initialize: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        if (place.route) {
          this.navigate('map/' + this.route, {silent: true});
        }
      }, this));
      this.setMapSize();
      this.placeService = new PlaceService(mapLayerService, this);
      this.layersNavView = new LayersNavView();
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
        mps.publish(
          'Place/update', [{go: true, name: 'map', params: params}]);
      }, this));
    },

    setMapSize: function() {
      var dh   = $(window).height(),
          $map = $('#map');

      $map.height(dh - 69);
      $('.header-nav__logo').css({ position: 'absolute', top: 69 });
      setTimeout(function() {
        $('html, body').scrollTop(69);
      }, 500);
    }

  });

  var router = new Router();

  return router;

});
