/**
 * The MapMiniView class for the Google Map.
 *
 * @return MapMiniView class (extends Backbone.View)
 */

define([
  'backbone',
  'underscore',
  'mps',
  'cookie',
  'map/views/maptypes/grayscaleMaptype',
  'map/helpers/layersHelper'
], function(Backbone, _, mps, Cookies, grayscaleMaptype, layersHelper) {

  'use strict';

  var MapMiniView = Backbone.View.extend({

    el: '#map',

    /**
     * Google Map Options.
     */
    options: {
      zoom: 3,
      minZoom: 3,
      mapTypeId: 'grayscale',
      center: new google.maps.LatLng(15, 27),
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
     * Constructs a new MapMiniView and its presenter.
     */
    initialize: function() {
      if (!this.$el.length) {
        return;
      }
      this.render();
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function() {
      this.map = new google.maps.Map(this.el, _.extend({}, this.options));
      this._setMaptypes();
      this._addListeners();
    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addListeners: function() {

    },


    /**
     * Set map options from the suplied options object.
     *
     * @param {Object} options
     */
    setOptions: function(options) {
      this.map.setOptions(options);
      this.onCenterChange();
      this.presenter.onMaptypeChange(options.mapTypeId);
    },

    /**
     * Add passed layers to the map and remove the rest.
     *
     * @param {object} layers  Layers object
     * @param {object} options Layers options from url
     */
    setLayers: function(layers, options) {
      _.each(this.layerInst, function(inst, layerSlug) {
        !layers[layerSlug] && this._removeLayer(layerSlug);
      }, this);

      layers = _.sortBy(_.values(layers), 'position');
      this._addLayers(layers, options);
    },

    /**
     * Add layers to the map one by one, waiting until the layer before
     * is already rendered. This way we can get the layer order right.
     *
     * @param {array}   layers  layers array
     * @param {object}  options layers options eg: threshold, currentDate
     * @param {integer} i       current layer index
     */
    _addLayers: function(layers, options, i) {
      i = i || 0;
      var layer = layers[i];

      var _addNext = _.bind(function() {
        i++;
        layers[i] && this._addLayers(layers, options, i);
      }, this);

      if (layer && !!layersHelper[layer.slug]) {
        if ((!layersHelper[layer.slug].view || this.layerInst[layer.slug])) {
          _addNext();
          return;
        }
        var layerView = this.layerInst[layer.slug] =
          new layersHelper[layer.slug].view(layer, options, this.map);

        layerView.addLayer(layer.position, _addNext);
      }

    },

    /**
     * Get layer position. If layer.position doesn't exist,
     * position is 0 (at the bottom), else it calculates the right position.
     *
     * @param  {object} layer
     * @return {integer} position
     */
    _getOverlayPosition: function(layer) {
      var position = 0;
      var layersCount = this.map.overlayMapTypes.getLength();
      if (typeof layer.position !== 'undefined' && layer.position <= layersCount) {
        position = layersCount - layer.position;
      }
      return position;
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
      var options = {};
      var layer = this.layerInst[layerSlug];
      options.currentDate = layer.currentDate ? layer.currentDate : null;
      options.threshold = layer.threshold ? layer.threshold : null;
      this._removeLayer(layerSlug);
      this._addLayers([layer.layer], options);
    },



    /**
     * Used by MapPresenter to set the map center.
     *
     * @param {Number} lat The center latitude
     * @param {Number} lng The center longitude
    */
    // Center
    getCenter: function() {
      var center = this.map.getCenter();
      return {
        lat: center.lat(),
        lng: center.lng()
      };
    },
    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    // Zoom
    getZoom: function() {
      this.map.getZoom();
    },
    setZoom: function(zoom) {
      this.map.setZoom(zoom);
    },

    // Bounds
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
     * Set additional maptypes to this.map.
     */
    _setMaptypes: function() {
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
    },

  });

  return MapMiniView;

});
