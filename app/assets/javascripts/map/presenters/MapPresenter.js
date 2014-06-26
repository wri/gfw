/**
 * The MapPresenter class for the MapView.
 *
 * @return MapPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

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
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Map/set-zoom', _.bind(function(zoom) {
        this.view.setZoom(zoom);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        if (place.getName() === 'map') {
          this._initMap(place);
          this._initLayers(place);
        }
      }, this));  
    },

    /**
     * Initialize map state from supplied place.
     * 
     * @param  {PlaceService} The place to go to
     */
    _initMap: function(place) {
      var zoom = place.getMapZoom();
      var center = place.getMapCenter();
      var mapTypeId = place.getMapTypeId();

      this.view.setZoom(zoom);
      this.view.setCenter(center.lat, center.lng);
      this.view.setMapTypeId(mapTypeId);
    },

    /**
     * Initialize map layer state from supplied place.
     * 
     * @param  {PlaceService} The place to go to
     */
    _initLayers: function(place) {
      place.getMapLayers(_.bind(function(layers) {
        this.view.initLayers(layers);
        mps.publish('Map/layers-initialized', []);
      }, this));
    },

    /**
     * Used by MapView to delegate zoom change UI events. Results in the
     * Map/zoom-change event getting published with the new zoom.
     * 
     * @param  {integer} zoom the new map zoom
     */
    onZoomChange: function(zoom) {
      mps.publish('Map/zoom-change', [zoom]);
    },

    /**
     * Used by MapView to delegate map center change UI events. Results in
     * Map/center-change event getting published with the new map zoom.
     * 
     * @param  {number} lat new map center latitude
     * @param  {number} lng new map center longitude
     */
    onCenterChange: function(lat, lng) {
      mps.publish('Map/center-change', [lat, lng]);
    }

  });

  return MapPresenter;
});