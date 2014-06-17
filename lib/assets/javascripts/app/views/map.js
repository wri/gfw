/**
 * The map module.
 *
 * View for the Google Map.
 * 
 * @return singleton instance of Map class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenter',
  'gmap',
  'mps'
], function(Backbone, _, presenter, gmap, mps) {

  var Map = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'onZoomChange');
      //this.render();

      // Subscribe to add layer events
      mps.subscribe('map/add-layer', _.bind(function(layer) {
        this.addLayer(layer);
      }, this));

      // Subscribe to remove layer events
      mps.subscribe('map/remove-layer', _.bind(function(layer) {
        this.removeLayer(layer);
      }, this));
    },

    render: function() {
      console.log('MAP');      
      // gmap.init(_.bind(function() {
        var options = this.getMapOptions();
        options.center = new google.maps.LatLng(40.412568, -3.711133);
        options.minZoom = 3;
        this.map = new google.maps.Map(document.getElementById('map'), options);
        google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChange);
        this.resize();
      // }, this));
    },

    /**
     * Add supplied layer to map.
     */
    addLayer: function(layer) {
      this.map.overlayMapTypes.push(layer);
    },

    /**
     * Remove layer from map using supplied layer name.
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

    updateMap: function() {
      this.map.setOptions(this.getMapOptions());
    },

    getMapOptions: function() {
      return {
        zoom: presenter.get('zoom'),
        mapTypeId: presenter.get('mapType')
      };
    },

    onZoomChange: function() {
      presenter.set('zoom', this.map.zoom, {silent: true});
      presenter.updateUrl();
    },

    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    },
  });

  var map = new Map();

  return map;

});