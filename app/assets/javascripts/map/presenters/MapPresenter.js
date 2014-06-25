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
        if (place.name === 'map') {
          this._initMap(place);
          this._initLayers(place);
        }
      }, this));  
    },

    /**
     * Initialize map state from supplied place.
     * 
     * @param  {object} place The router Place to go to
     */
    _initMap: function(place) {
      var zoom = Number(place.params.zoom);
      var lat = Number(place.params.lat);
      var lng = Number(place.params.lng);

      this.view.setZoom(zoom);
      this.view.setCenter(lat, lng);
      this.view.setMapTypeId(place.params.maptype);
    },

    /**
     * Initialize map layer state from supplied place.
     * 
     * @param  {object} place The router Place to go to
     */
    _initLayers: function(place) {
      var params = place.params;
      var baselayers = params.baselayers ? params.baselayers.split(',') : [];
      var baseWhere = _.map(baselayers, function (x) {
        return {slug: x, category_slug: 'forest_clearing'};
      });
      var sublayers = params.sublayers ? params.sublayers.split(',') : [];
      var subWhere = _.map(sublayers, function(x) {
        return {id: x};
      });
      var where = _.union(baseWhere, subWhere);

      // Get layers from service and add them to the map view
      mapLayerService.getLayers(
        where,
        _.bind(function(layers) {
          this.view.initLayers(layers);
          mps.publish('Map/layers-initialized', []);
        }, this),
        _.bind(function(error) {
          console.error(error);
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