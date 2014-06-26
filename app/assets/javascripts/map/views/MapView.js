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
  'views/layers/UMDLossLayerView'
], function(Backbone, _, Presenter, AnalysisButtonView, UMDLossLayerView) {

  var MapView = Backbone.View.extend({

     el: '#map',

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {      
      this.presenter = new Presenter(this);
      this.layerViews = {};
    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function() {
      var options = {
        minZoom: 3,
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        center: new google.maps.LatLng(15, 27)
      };

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
     * Used by MapPresenter to remove a layer by name.
     * 
     * @param  {string} name The name of the layer to remove
     */
    removeLayer: function(name) {
      var overlays_length = this.map.overlayMapTypes.getLength();
      if (overlays_length > 0) {
        for (var i = 0; i< overlays_length; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name == name) this.map.overlayMapTypes.removeAt(i);
        }
      }
    },
  
    /**
     * Used by MapPresenter to add a layer to the map.
     * 
     * @param {Object} layer The layer object
     */
    addLayer: function(layer) {
      var layerView = null;

      if (layer.slug === 'loss') {
        if (!_.has(this.layerViews, 'loss')) {
          layerView = new UMDLossLayerView();
          this.layerViews.loss = layerView;
        }
      }
      this.map.overlayMapTypes.insertAt(0, layerView);
    },

    /**
     * Used by MapPresenter to set the map zoom.
     * 
     * @param {integer} zoom The map zoom to set
     */
    setZoom: function(zoom) {
      this.map.setZoom(zoom);
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

    /**
     * Used by MapPresenter to set the map type.
     * 
     * @param {string} maptype The map type id.
     */
    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
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