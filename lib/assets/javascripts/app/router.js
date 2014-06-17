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
  'views/map'
], function ($, _, Backbone, mps, gmap, presenter, layers, map) {
  
  var Router = Backbone.Router.extend({

    routes: {
      "map/:baseLayer/:zoom/:mapType/:sublayers": "home",
    },

    initialize: function() {
      console.log('router.initialize()');
      Backbone.Router.prototype.initialize.call(this);
      mps.subscribe('navigate', _.bind(function (place) {
        this.path = place.path;
        delete place.path;
        this.navigate(this.path, place);
      }, this));
    },

    home: function(baseLayer, zoom, mapType, sublayers) {      
      gmap.init(_.bind(function() {  // Async Google Maps API loading
        map.render();
        layers.fetch();
        layers.bind('reset', function() {
          presenter.setFromUrl({
            baseLayer: baseLayer || 'umd_tree_loss_gain',
            zoom: Number(zoom) || 3,
            mapType: mapType || 'terrain',
            sublayers: sublayers || ''
          });
        });
    }, this));
    }
  });

  var router = new Router();

  return router;

});