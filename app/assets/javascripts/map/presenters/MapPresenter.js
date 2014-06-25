/**
 * The MapPresenter class for the MapView.
 *
 * @return MapPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/MapLayerService'
], function(Class, _, mps, mapLayerService) {

  var MapPresenter = Class.extend({

    /**
     * Constructs new MapPresenter.
     * 
     * @param  {MapView} Instance of MapView
     * 
     * @return {class} The MapPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('Map/set-zoom', _.bind(function(zoom) {
        this.view.setZoom(zoom);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        if (place.name === 'map') {
          this.initMap(place);
          this.initLayers(place);
        }
      }, this));  
    },

    initMap: function(place) {
      var zoom = Number(place.params.zoom);
      var lat = Number(place.params.lat);
      var lng = Number(place.params.lng);

      this.view.setZoom(zoom);
      this.view.setCenter(lat, lng);
      this.view.setMapTypeId(place.params.maptype);
    },

    initLayers: function(place) {
      mapLayerService.getForestChangeLayer(
        place.params.baselayers,
        _.bind(function(layer) {
          this.view.addLayer(layer);
        }, this),
        _.bind(function(error) {
          console.error(error);
        }, this));
    },

    onZoomChange: function(zoom) {
      mps.publish('Map/zoom-change', [zoom]);
    },

    onCenterChange: function(lat, lng) {
      mps.publish('Map/center-change', [lat, lng]);
    }

  });

  return MapPresenter;

});