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
  'views/layers/ImazonLayer',
  'views/layers/PantropicalLayer'
], function(Backbone, _, Presenter, AnalysisButtonView, UMDLossLayer, Forest2000Layer, GainLayer, ImazonLayer, PantropicalLayer) {

  'use strict';

  var MapView = Backbone.View.extend({

    el: '#map',

    options: {
      minZoom: 3,
      backgroundColor: '#99b3cc',
      disableDefaultUI: true,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false
    },

    layersViews: {
      umd_tree_loss_gain: UMDLossLayer,
      forest2000: Forest2000Layer,
      gain: GainLayer,
      imazon: ImazonLayer,
      pantropical: PantropicalLayer
    },

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      // Layer view instances
      this.layerInst = {};
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function(params) {
      params = {
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng),
      };

      this.map = new google.maps.Map(this.el, _.extend({}, this.options, params));
      this.resize();
      this._setMaptypes();
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
      this.render(params);
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

    /**
     * Used by MapPresenter to set the layerSpec layers.
     *
     * @param {object} layerSpec
     */
    setLayerSpec: function(layerSpec) {
      var self = this;
      var activeLayers = {};

      _.each(layerSpec, function(category) {
        _.extend(activeLayers, category);
      });

      // Remove layers
      _.each(this.layerInst, function(inst, layerSlug) {
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
     * Used by MapPresenter to add a layer to the map.
     *
     * @param {Object} layer The layer object
     */
    addLayer: function(layer) {
      this.layerInst[layer.slug] = this.layerInst[layer.slug] ||
        new this.layersViews[layer.slug](layer, this.map);

      this.layerInst[layer.slug].render();
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
            return true;
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

    fitBounds: function(bounds) {
      this.map.fitBounds(bounds);
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
    },

    /**
     * Set additional maptypes to this.map.
     */
    _setMaptypes: function() {
      var grayscale = new google.maps.StyledMapType([{
        'featureType': 'water'
      }, {
        'featureType': 'transit',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'road',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'poi',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'landscape',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'administrative',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [{
          'visibility': 'off'
        }]
      }], {
        name: 'grayscale'
      });

      var treeheight = new google.maps.ImageMapType({
        getTileUrl: function(ll, z) {
          var X = Math.abs(ll.x % (1 << z)); // jshint ignore:line
          return '//gfw-apis.appspot.com/gee/simple_green_coverage/' + z + '/' + X + '/' + ll.y + '.png';
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 17,
        name: 'Forest Height',
        alt: 'Global forest height'
      });

      this.map.mapTypes.set('grayscale', grayscale);
      this.map.mapTypes.set('treeheight', treeheight);
    }
  });

  return MapView;

});
