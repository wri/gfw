/**
 * The MapView class for the Google Map.
 *
 * @return MapView class (extends Backbone.View)
 */

define([
  'backbone',
  'underscore',
  'mps',
  'presenters/MapPresenter',
  'views/maptypes/grayscaleMaptype',
  'views/maptypes/treeheightMaptype',
  'views/maptypes/landsatMaptype',
  'views/layers/UMDLossLayer',
  'views/layers/ForestGainLayer',
  'views/layers/FormaLayer',
  'views/layers/FormaCoverLayer',
  'views/layers/ImazonLayer',
  'views/layers/ImazonCoverLayer',
  'views/layers/ModisLayer',
  'views/layers/ModisCoverLayer',
  'views/layers/FiresLayer',
  'views/layers/Forest2000Layer',
  'views/layers/IntactForestLayer',
  'views/layers/PantropicalLayer',
  'views/layers/IdnPrimaryLayer',
  'views/layers/LoggingLayer',
  'views/layers/MiningLayer',
  'views/layers/OilPalmLayer',
  'views/layers/WoodFiberPlantationsLayer',
  'views/layers/ProtectedAreasLayer',
  'views/layers/BiodiversityHotspotsLayer',
  'views/layers/ResourceRightsLayer',
  'views/layers/LandRightsLayer',
  'views/layers/UserStoriesLayer',
  'views/layers/MongabayStoriesLayer',
  'views/layers/InfoamazoniaStoriesLayer'
], function(Backbone, _, mps, Presenter, grayscaleMaptype, treeheightMaptype, landsatMaptype,
  UMDLossLayer, ForestGainLayer, FormaLayer, FormaCoverLayer, ImazonLayer, ImazonCoverLayer, ModisLayer, ModisCoverLayer, FiresLayer, Forest2000Layer,
  IntactForestLayer, PantropicalLayer, IdnPrimaryLayer, LoggingLayer, MiningLayer, OilPalmLayer, WoodFiberPlantationsLayer,
  ProtectedAreasLayer, BiodiversityHotspotsLayer, ResourceRightsLayer, LandRightsLayer, UserStoriesLayer, MongabayStoriesLayer, InfoamazoniaStoriesLayer) {

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
      forma_cover: FormaCoverLayer,
      imazon: ImazonLayer,
      imazon_cover: ImazonCoverLayer,
      modis: ModisLayer,
      modis_cover: ModisCoverLayer,
      fires: FiresLayer,
      forest2000: Forest2000Layer,
      intact_forest: IntactForestLayer,
      pantropical: PantropicalLayer,
      idn_primary: IdnPrimaryLayer,
      logging: LoggingLayer,
      mining: MiningLayer,
      oil_palm: OilPalmLayer,
      wood_fiber_plantations: WoodFiberPlantationsLayer,
      protected_areas: ProtectedAreasLayer,
      biodiversity_hotspots: BiodiversityHotspotsLayer,
      resource_rights: ResourceRightsLayer,
      land_rights: LandRightsLayer,
      user_stories: UserStoriesLayer,
      mongabay: MongabayStoriesLayer,
      infoamazonia: InfoamazoniaStoriesLayer
    },

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      this.layerInst = {};
      this.$maplngLng = $('.map-container .map-latlng');
      this.render();
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function() {
      var params = {
        zoom: 3,
        mapTypeId: 'grayscale',
        center: new google.maps.LatLng(15, 27),
      };

      this.map = new google.maps.Map(this.el, _.extend({}, this.options, params));
      this.resize();
      this._setMaptypes();
      this._setZoomControl();
      this._addListeners();
      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function() {
        this.$el.addClass('is-loaded');
      }, this));
    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addListeners: function() {
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onZoomChange();
          this.onCenterChange();
        }, this)
      );
      google.maps.event.addListener(this.map, 'dragend',
        _.bind(function() {
          this.onCenterChange();
      }, this));

      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function() {
        this.$el.addClass('is-loaded');
      }, this));

      google.maps.event.addListener(this.map, 'click', _.bind(function(wdpa) {
        if (!(!!wdpa.wdpaid)) {
          return;
        }
        mps.publish('MapView/click-protected', [wdpa]);
      }, this));
    },

    setOptions: function(params) {
      params = {
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng)
      };

      this.map.setOptions(params);
      this.onCenterChange();
      this.presenter.onMaptypeChange(params.mapTypeId);
    },

    /**
     * Add passed layers to the map and remove the rest.
     *
     * @param {object} layers  Layers object
     * @param {object} options Layers options from url
     */
    setLayers: function(layers, options) {
      // Remove layers if needed
      _.each(this.layerInst, function(inst, layerSlug) {
        if (!layers[layerSlug]) {
          this._removeLayer(layerSlug);
        }
      }, this);

      /**
       * Sort layers by position before calling.
       * This way layers are going to be rendered always on the right order.
       */
      layers = _.sortBy(_.values(layers), 'position');
      _.each(layers, function(layer) {
        this._addLayer(layer, options);
      }, this);
    },

    /**
     * Used by MapView to add a layer to the map.
     *
     * @param {Object} layer The layer object
     * @param {object} options Layers options from url
     */
    _addLayer: function(layer, options) {
      if (this.layersViews[layer.slug] && !this.layerInst[layer.slug]) {
        var layerView = this.layerInst[layer.slug] =
          new this.layersViews[layer.slug](layer, options, this.map);

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

    updateLayer: function(layerSlug) {
      var layer = this.layerInst[layerSlug].layer;
      this._removeLayer(layerSlug);
      this._addLayer(layer);
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
      this.presenter.onMaptypeChange(maptype);
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
      this.updateLatlngInfo(lat,lng);
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
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
      this.map.mapTypes.set('treeheight', treeheightMaptype());
      for (var i = 1999; i < 2013; i++) {
        this.map.mapTypes.set('landsat{0}'.format(i), landsatMaptype([i]));
      }
    },

    _setZoomControl: function() {
      $('.zoom-in').on('click', _.bind(function() {
        this.setZoom(this.getZoom() + 1);
      }, this));
      $('.zoom-out').on('click', _.bind(function() {
        this.setZoom(this.getZoom() - 1);
      }, this));
    },

    /**
     * Updates
     */
    updateLatlngInfo: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$maplngLng.html(html);
    }

  });

  return MapView;

});
