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
  'views/map'
], function ($, _, Backbone, mps, gmap, presenter, map) {
  
  var Router = Backbone.Router.extend({

    routes: {
      'map': 'map',
      'map/:baseLayer/:zoom/:mapType': 'map',
    },

    initialize: function() {
      console.log('router.initialize()');
      Backbone.Router.prototype.initialize.call(this);
      mps.subscribe('navigate', _.bind(function (place) {
        this.path = place.path;
        delete place.path;
        this.navigate('map/' + this.path, place);
      }, this));
    },

    map: function(baseLayer, zoom, mapType) {
      console.log('map')
      gmap.init(_.bind(function() {  // Async Google Maps API loading
        map.render();
        presenter.setFromUrl({
          baseLayer: baseLayer,
          zoom: Number(zoom),
          mapType: mapType
        });
      }, this));
    }
  });

  var router = new Router();

  return router;

});