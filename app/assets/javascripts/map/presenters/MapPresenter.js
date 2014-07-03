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
], function(Class, _, mps) {

  'use strict';

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
          this.layers = place.params.layers;
          this._initMap(place.params);
          this._initLayers(this.layers);
        }
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.view.setLayerSpec(layerSpec);
      },this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Initialize map state from supplied place.
     *
     * @param  {PlaceService} The place to go to
     */
    _initMap: function(params) {
      this.view.initMap(params);
      mps.publish('Map/initialized', []);
    },

    /**
     * Initialize map layer state from supplied place.
     *
     * @param  {PlaceService} The place to go to
     */
    _initLayers: function(layers) {
      this.view.initLayers(layers);
      mps.publish('Map/layers-initialized', []);
    },

    /**
     * Retuns place parameters representing the state of the MapView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the MapView and layers
     */
    getPlaceParams: function() {
      var params = {};
      var mapCenter = this.view.getCenter();
      // var baseLayers = _.where(this.layers, {category_slug: 'forest_clearing'});
      // var subLayers = _.filter(this.layers, function(layer) {
      //   return layer.category_slug !== 'forest_clearing';
      // });

      params.zoom = this.view.getZoom();
      params.lat = mapCenter.lat;
      params.lng = mapCenter.lng;
      params.maptype = this.view.getMapTypeId();
      // params.baselayers = _.map(baseLayers, function(layer) {
      //   return layer.slug;
      // });
      // params.sublayers = _.map(subLayers, function(layer) {
      //   return layer.id;
      // });

      return params;
    },

    /**
     * Used by MapView to delegate zoom change UI events. Results in the
     * Map/zoom-change event getting published with the new zoom.
     *
     * @param  {integer} zoom the new map zoom
     */
    onZoomChange: function(zoom) {
      mps.publish('Map/zoom-change', [zoom]);
      mps.publish('Place/update', [{go: false}]);
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
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return MapPresenter;
});
