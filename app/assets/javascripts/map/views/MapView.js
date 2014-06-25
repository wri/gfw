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

    render: function() {
      var options = {
        minZoom: 3,
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        center: new google.maps.LatLng(15, 27)
      };

      this.map = new google.maps.Map(this.el, options);
      this.resize();
      this.addCompositeViews();
      this.addListeners();
    },

    addCompositeViews: function() {
      this.$el.append(new AnalysisButtonView().$el);
    },

    addListeners: function() {
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

    initLayers: function(layers) {
      this.map.overlayMapTypes.clear();
      _.map(layers, this.addLayer, this);
    },

    removeLayer: function(name) {
      var overlays_length = this.map.overlayMapTypes.getLength();
      if (overlays_length > 0) {
        for (var i = 0; i< overlays_length; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name == name) this.map.overlayMapTypes.removeAt(i);
        }
      }
    },
    
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

    setZoom: function(zoom) {
      this.map.setZoom(zoom);
    },

    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
    },

    onZoomChange: function() {
      this.presenter.onZoomChange(this.map.zoom);
    },

    onCenterChange: function() {
      var center = this.map.getCenter();
      var lat = center.lat();
      var lng = center.lng();

      this.presenter.onCenterChange(lat, lng);
    },

    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    }
    
  });

  return MapView;

});