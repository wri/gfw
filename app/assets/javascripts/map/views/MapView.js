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
  'views/layers/ForestGainLayer',
  'views/layers/FormaLayer',
  'views/layers/ImazonLayer',
  'views/layers/ModisLayer',
  'views/layers/FiresLayer',
  'views/layers/Forest2000Layer',
  'views/layers/IntactForestLayer',
  'views/layers/PantropicalLayer',
  'views/layers/LoggingLayer',
  'views/layers/MiningLayer',
  'views/layers/OilPalmLayer',
  'views/layers/WoodFiberPlantationsLayer',
  'views/layers/ProtectedAreasLayer',
  'views/layers/BiodiversityHotspotsLayer',
  'views/layers/ResourceRightsLayer',
  'views/layers/UserStoriesLayer',
  'views/layers/MongabayStoriesLayer'
], function(Backbone, _, Presenter, AnalysisButtonView,
  UMDLossLayer, ForestGainLayer, FormaLayer, ImazonLayer, ModisLayer, FiresLayer, Forest2000Layer,
  IntactForestLayer, PantropicalLayer, LoggingLayer, MiningLayer, OilPalmLayer, WoodFiberPlantationsLayer,
  ProtectedAreasLayer, BiodiversityHotspotsLayer, ResourceRightsLayer, UserStoriesLayer, MongabayStoriesLayer) {

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

    /**
     * Map layer slug with layer views.
     */
    layersViews: {
      umd_tree_loss_gain: UMDLossLayer,
      forestgain: ForestGainLayer,
      forma: FormaLayer,
      imazon: ImazonLayer,
      modis: ModisLayer,
      fires: FiresLayer,
      forest2000: Forest2000Layer,
      intact_forest: IntactForestLayer,
      pantropical: PantropicalLayer,
      logging: LoggingLayer,
      mining: MiningLayer,
      oil_palm: OilPalmLayer,
      wood_fiber_plantations: WoodFiberPlantationsLayer,
      protected_areas: ProtectedAreasLayer,
      biodiversity_hotspots: BiodiversityHotspotsLayer,
      resource_rights: ResourceRightsLayer,
      user_stories: UserStoriesLayer,
      mongabay: MongabayStoriesLayer
    },

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
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
      this._setZoomControl();
      this._addCompositeViews();
      this._addListeners();

      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function() {
        this.$el.addClass('is-loaded');
      }, this));
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
     * Add passed layers to the map and remove the rest.
     *
     * @param {object} layers
     */
    setLayers: function(layers) {
      // Remove layers if needed
      _.each(this.layerInst, _.bind(function(inst, layerSlug) {
          if (!layers[layerSlug]) {
            this._removeLayer(layerSlug);
          }
        }, this));

      /**
       * Sort layers by position before calling.
       * This way layers are going to be rendered always on the right order.
       */
      _.map(_.sortBy(_.values(layers), 'position'),
        this._addLayer, this);
    },

    /**
     * Used by MapView to add a layer to the map.
     *
     * @param {Object} layer The layer object
     */
    _addLayer: function(layer) {
      if (this.layersViews[layer.slug] && !this.layerInst[layer.slug]) {
        var layerView = this.layerInst[layer.slug] =
          new this.layersViews[layer.slug](layer, this.map);

        var position = 0;
        var layersCount = this.map.overlayMapTypes.getLength();

        if (typeof layer.position !== 'undefined' && layer.position <= layersCount) {
          position = layersCount - layer.position;
        }

        layerView.addLayer({position: position});
      }
    },

    /**
     * Used by MapPresenter to remove a layer by layerSlug.
     *
     * @param  {string} layerSlug The layerSlug of the layer to remove
     */
    _removeLayer: function(layerSlug) {
      var inst = this.layerInst[layerSlug];
      if (!inst) {return;}
      inst.removeLayer();
      inst.presenter && inst.presenter.unsubscribe && inst.presenter.unsubscribe();
      this.layerInst[layerSlug] = null;
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
        }, {
          'lightness': 90
        }]
      }, {
        'featureType': 'administrative',
        'stylers': [{
          'saturation': -100
        }]
      }, {
        'featureType': 'poi',
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
    },

    _setZoomControl: function() {
      $('.zoom-in').on('click', _.bind(function() {
        this.setZoom(this.getZoom() + 1);
      }, this));
      $('.zoom-out').on('click', _.bind(function() {
        this.setZoom(this.getZoom() - 1);
      }, this));
    }

  });

  return MapView;

});
