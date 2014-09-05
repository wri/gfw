/**
 * The MapPresenter class for the MapView.
 *
 * Requirements:
 *   - On 'Place/go' should set the map options and layers from the layerSpec.
 *   - On 'LayerNav/change' should set the map layers from the layerSpec.
 *   - getPlaceParams should return:
 *       * zoom
 *       * lat
 *       * long
 *       * maptype
 *
 * @return MapPresenter class.
 */
define([
  'underscore',
  'backbone',
  'Class',
  'mps'
], function(_, Backbone, Class, mps) {

  'use strict';

  /**
   * StatusModel keeps the prensenter current status.
   */
  var StatusModel = Backbone.Model.extend({
    defaults: {
      threshold: null
    }
  });

  /**
   * The MapPresenter Class.
   */
  var MapPresenter = Class.extend({

    /**
     * Initialize the MapPresenter.
     *
     * @param  {Object} view MapView
     */
    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._subscribe();
      mps.publish('Place/register', [this]);
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this._onPlaceGo(place);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setLayers(layerSpec.getLayers());
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
        this._updateStatusModel({
          threshold: threshold
        });
      }, this));
    },

    /**
     * Triggered from 'Place/Go' events.
     *
     * @param  {Object} place PlaceService's place object
     */
    _onPlaceGo: function(place) {
      if (place.params.name !== 'map') {return;}
      var layerOptions = {};

      this._setMapOptions(
        _.pick(place.params,
          'zoom', 'maptype', 'lat', 'lng'));

      if (place.params.begin && place.params.end) {
        layerOptions.currentDate = [place.params.begin, place.params.end];
      }

      this._updateStatusModel(place.params);
      this._setLayers(place.layerSpec.getLayers(), layerOptions);
    },

    /**
     * Update the status model from the suplied params.
     *
     * @param  {Object} params
     */
    _updateStatusModel: function(params) {
      if (params.threshold) {
        this.status.set('threshold', params.threshold);
      }
    },

    /**
     * Set the map layers to match the suplied layers
     * and the current layer options status.
     *
     * @param {object} layers Layers object
     */
    _setLayers: function(layers, layerOptions) {
      // Get layer options. We need the currentDate just when loading
      // a layer first time from url. When changing between layers
      // there is no date so it will be set to the default layer date.
      var options = _.extend(_.pick(this.status.toJSON(),
        'threshold'), layerOptions);

      this.view.setLayers(layers, options);
    },

    /**
     * Construct the options object from the suplied params
     * and dispache to the them to the view.
     *
     * @param {Object} params Map params from the place object.
     */
    _setMapOptions: function(params) {
      var options = {
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng)
      };

      this.view.setOptions(options);
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
     * @return {Object} Params representing the state of the MapView
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
