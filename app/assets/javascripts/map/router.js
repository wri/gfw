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
  'presenter',
  'collections/layers',
  'views/MapView',
  'services/PlaceService'
], function($, _, Backbone, mps, gmap, presenter, layersCollection, MapView,
  PlaceService) {
  
  var Router = Backbone.Router.extend({

    routes: {
      'map': 'map',
      'map/:zoom/:lat/:lng/:iso/:maptype/:baselayers(/:sublayers)(/)': 'map',
    },

    initialize: function() {
      console.log('router.initialize()');
      Backbone.Router.prototype.initialize.call(this);
      _.bindAll(this, 'navigateTo');
      mps.subscribe('navigate', this.navigateTo);
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
      var place = new PlaceService('map', params);
    
      gmap.init(_.bind(function() {
        if (!this.mapView) {
          this.mapView = new MapView();
          this.mapView.render();
        }
        mps.publish('Place/go', [place]);
      }, this));
    },

    navigateTo: function(place) {
      this.path = place.path;
      delete place.path;
      this.navigate('map/' + this.path, place);
    },

    setMapSize: function() {
      var dh   = $(window).height(),
          $map = $('#map');

      $map.height(dh - 69);
      $('.header-nav__logo').css({ position: 'absolute', top: 69 })
      setTimeout(function() {
        $('html, body').scrollTop(69);
      }, 500);
    }

  });

  var router = new Router();

  return router;

});