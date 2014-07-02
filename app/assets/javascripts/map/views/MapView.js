/**
 * The MapView class for the Google Map.
 *
 * @return MapView class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/MapPresenter',
  'views/AnalysisButtonView',
  'views/layers/UMDLossLayer',
  'views/layers/Forest2000Layer',
  'views/layers/GainLayer',
  'views/layers/ImazonLayer'
], function(Backbone, _, Presenter, AnalysisButtonView, UMDLossLayer, Forest2000Layer, GainLayer, ImazonLayer) {

  'use strict';

  var MapView = Backbone.View.extend({

     el: '#map',

     layersViews: {
      umd_tree_loss_gain: UMDLossLayer,
      forest2000: Forest2000Layer,
      gain: GainLayer,
      imazon: ImazonLayer
     },

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      this.layerViewsInst = {};
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function(options) {
      this.map = new google.maps.Map(this.el, options);
      this.resize();
      this._addCompositeViews();
      this._addListeners();
    },

    /**
     * Adds any default composite views to the map.
     */
    _addCompositeViews: function() {
      this.$el.append(new AnalysisButtonView().$el);
    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addListeners: function() {
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onZoomChange();
        }, this)
      );
      google.maps.event.addListener(this.map, 'dragend',
        _.bind(function() {
          this.onCenterChange();
      }, this));
    },

    initMap: function(params) {
      var options = {
        minZoom: 3,
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng)
      };
      this.render(options);
    },

    /**
     * Used by MapPresenter to initialize the map view. This function clears
     * all layers from the map and then adds supplied layers in order.
     *
     * @param  {Array} layers Array of layer objects
     */
    initLayers: function(layers) {
      this.map.overlayMapTypes.clear();
      _.map(layers, this.addLayer, this);
    },

    setLayerSpec: function(layerSpec) {
      var self = this;
      var activeLayers = {};

      _.each(layerSpec, function(category, i) {
        activeLayers = _.extend(activeLayers, category);
      });

      // Remove layers
      _.each(this.layerViewsInst, function(view, layerSlug) {
        if (!activeLayers[layerSlug] && self._isLayerRendered(layerSlug)) {
          self.removeLayer(layerSlug);
        }
      });

      // Render layers
      _.each(activeLayers, function(layer) {
        if (!self._isLayerRendered(layer.slug)) {
          self.addLayer(layer);
        }
      });
    },

    /**
     * Used by map presenter to toggle a layer.
     *
     * @param  {object} layer The layer object
     */
    toggleLayer: function(layer) {
      if (this._isLayerRendered(layer.slug)) {
        this.removeLayer(layer.slug);
      } else {
        this.addLayer(layer);
      }
    },

    /**
     * Used by MapPresenter to add a layer to the map.
     *
     * @param {Object} layer The layer object
     */
    addLayer: function(layer) {
      var layerView = null;

      if (!_.has(this.layerViewsInst, layer.slug)) {
        var LayerView = this.layersViews[layer.slug];
        layerView = new LayerView(layer, this.map);
        this.layerViewsInst[layer.slug] = layerView;
      } else {
        layerView = this.layerViewsInst[layer.slug]
      }
      if (layer.slug !== 'imazon') {
        this.map.overlayMapTypes.insertAt(0, layerView);
      } else {
        layerView.render();
      }
    },

    /**
     * Used by MapPresenter to remove a layer by layerSlug.
     *
     * @param  {string} layerSlug The layerSlug of the layer to remove
     */
    removeLayer: function(layerSlug) {
      var overlaysLength = this.map.overlayMapTypes.getLength();
      if (overlaysLength > 0) {
        for (var i = 0; i< overlaysLength; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name === layerSlug) {
            this.map.overlayMapTypes.removeAt(i);
          }
        }
      }
    },

    /**
     * Check if a layer is already rendered by name.
     *
     * @param  {string} name The layer name
     */
    _isLayerRendered: function(name) {
      var overlaysLength = this.map.overlayMapTypes.getLength();
      if (overlaysLength > 0) {
        for (var i = 0; i< overlaysLength; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name === name) {
            return true
          }
        }
      }
    },

    /**
     * Used by MapPresenter to set the map zoom.
     *
     * @param {integer} zoom The map zoom to set
     */
    setZoom: function(zoom) {
      this.map.setZoom(zoom);
    },

    getZoom: function() {
      return this.map.getZoom();
    },

    /**
     * Used by MapPresenter to set the map center.
     *
     * @param {Number} lat The center latitude
     * @param {Number} lng The center longitude
     */
    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    getCenter: function() {
      var center = this.map.getCenter();

      return {lat: center.lat(), lng: center.lng()};
    },

    /**
     * Used by MapPresenter to set the map type.
     *
     * @param {string} maptype The map type id.
     */
    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
    },

    getMapTypeId: function() {
      return this.map.getMapTypeId();
    },

    /**
     * Handles a map zoom change UI event by dispatching to MapPresenter.
     */
    onZoomChange: function() {
      this.presenter.onZoomChange(this.map.zoom);
    },

    /**
     * Handles a map center change UI event by dispatching to MapPresenter.
     */
    onCenterChange: function() {
      var center = this.map.getCenter();
      var lat = center.lat();
      var lng = center.lng();

      this.presenter.onCenterChange(lat, lng);
    },

    /**
     * Resizes the map.
     */
    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    }

  });

  return MapView;

});
