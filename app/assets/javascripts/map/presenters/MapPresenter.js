/**
 * The MapPresenter class for the MapView.
 *
 * @return MapPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps'
], function(Class, _, Backbone, mps) {

  'use strict';

  var StatusModel = Backbone.Model.extend({});

  var MapPresenter = Class.extend({

    /**
     * Constructs new MapPresenter.
     *
     * @param  {MapView} Instance of MapView
     * @return {class} The MapPresenter class
     */
    init: function(view) {
      this.view = view;

      this.status = new StatusModel({
        threshold: null
      });

      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        if (place.params.name === 'map') {
          this._setMapOptions(place.params);
          if (place.params && place.params.threshold) {
            this.status.set('threshold', place.params.threshold);
          }
          this._setLayerSpec(place.layerSpec, place.params);
        }
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setLayerSpec(layerSpec);
      },this));

      mps.subscribe('Map/set-zoom', _.bind(function(zoom) {
        this.view.setZoom(zoom);
      }, this));

      mps.subscribe('Map/fit-bounds', _.bind(function(bounds) {
        this.view.fitBounds(bounds);
      }, this));

      mps.subscribe('Map/set-center', _.bind(function(lat, lng) {
        this.view.setCenter(lat, lng);
      }, this));

      mps.subscribe('Maptype/change', _.bind(function(maptype) {
        this.view.setMapTypeId(maptype);
      }, this));

      mps.subscribe('Layer/update', _.bind(function(layerslug) {
        this.view.updateLayer(layerslug);
      }, this));

      mps.subscribe('Timeline/disabled', _.bind(function() {
        this.view.$maplngLng.removeClass('hidden');
      }, this));

      mps.subscribe('Timeline/enabled', _.bind(function() {
        this.view.$maplngLng.addClass('hidden');
      }, this));

      mps.subscribe('Threshold/changed', _.bind(function(threshold) {
        this.status.set('threshold', threshold);
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * [_setLayerSpec description].
     *
     * @param {object} layerSpec
     * @param {object} placeParams
     */
    _setLayerSpec: function(layerSpec, placeParams) {
      var options = {};

      if (placeParams && placeParams.begin && placeParams.end) {
        options.currentDate = [placeParams.begin, placeParams.end];
      }

      if (this.status.get('threshold')) {
        options.threshold = this.status.get('threshold');
      }

      this.view.setLayers(layerSpec.getLayers(), options);
    },

    /**
     * Set map options state from supplied place.params.
     *
     * @param  {PlaceService} The place to go to
     */
    _setMapOptions: function(params) {
      this.view.setOptions(params);
    },

    onOptionsChange: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    onMaptypeChange: function(maptype) {
      mps.publish('Map/maptype-change', [maptype]);
      mps.publish('Place/update', [{go: false}]);
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
    },

    /**
     * Retuns place parameters representing the state of the MapView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the MapView and layers
     */
    getPlaceParams: function() {
      var p = {};
      var mapCenter = this.view.getCenter();

      p.name = 'map';
      p.zoom = this.view.getZoom();
      p.lat = mapCenter.lat;
      p.lng = mapCenter.lng;
      p.maptype = this.view.getMapTypeId();

      return p;
    }

  });

  return MapPresenter;
});
