/**
 * The HTML5 Canvas map layer module.
 *
 * @return OverlayLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  'mps',
  'map/views/layers/CustomInfowindow'
], function(Class, _, mps, CustomInfowindow) {

  'use strict';

  var OverlayLayerClass = Class.extend({

    defaults: {
      infowindow: false,
      infowindowContent: null,
      infowindowAPI: null,
      analysis: false
    },

    init: function(layer, options, map) {
      this.map = map;
      this.layer = layer;
      this.name = layer.slug;
      this.tileSize = new google.maps.Size(256, 256);
      this.options = _.extend({}, this.defaults, options || {}, this.options || {});
      this.setListeners();
    },

    setListeners: function() {
      mps.subscribe('Infowindow/close', _.bind(function(){
        this.removeMultipolygon();
      }, this ))
    },

    addLayer: function(position, success) {
      mps.publish('Map/loading', [true]);
      this._getLayer().then(_.bind(function(layer) {
        this.map.overlayMapTypes.setAt(position, layer);

        if (this.options.infowindow && this.options.interactivity && !this.options.highlight) {
          this.setInfowindow(layer);
        }
        if (this.options.highlight) {
          this.setHighlight(layer);
        }
        if (this.options.urlBounds) {
          this.checkForImagesInBounds();
        }

        success();
      }, this));

    },

    removeLayer: function() {
      var overlayIndex = this._getOverlayIndex();
      this.removeInfowindow();
      this.removeMultipolygon();
      if (overlayIndex > -1) {
        if (!!this.clearEvents) {
          this.clearEvents();
        };
        google.maps.event.clearListeners(this.map, 'click');
        this.map.overlayMapTypes.setAt(overlayIndex, null);
        // this.map.overlayMapTypes.removeAt(overlayIndex);
      }
    },

    /**
     * Create a infowindow object
     * and add to Map
     *
     * @return {object}
     */
    setInfowindow: function() {
      if (!this.infowindow && this.options.infowindowAPI) {

        google.maps.event.addListener(this.map, 'click', _.bind(function(ev) {
          if (!(!! ev.latLng)) {
            return;
          }
          var params = {
            lat: ev.latLng.lat(),
            lon: ev.latLng.lng()
          };

          this.removeInfowindow();

          this.options.infowindowAPI.execute(params, _.bind(function(data) {
            data[0].analysis = this.options.analysis;
            this.infowindow = new CustomInfowindow(ev.latLng, this.map, {
              infowindowData: data[0]
            });
          }, this));

        }, this));
      }
    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.remove();
      }
    },

    setHighlight: function(layer) {
    },

    removeMultipolygon: function() {
      if (!!this.multipolygon) {
        this.map.data.remove(this.multipolygon);
      }
    },

    _getOverlayIndex: function() {
      var index = -1;

      _.each(this.map.overlayMapTypes.getArray(), function(layer, i) {
        if (layer) {
          var layerName = layer.name || layer.options.name;
          if (layerName === this.getName()) {
            index = i;
          }
        }
      }, this);

      return index;
    },

    getName: function() {
      return this.name;
    },

    notificate: function(id)  {
      mps.publish('Notification/open', [id]);
    },

    hidenotification: function()  {
      mps.publish('Notification/close');
    }

  });

  return OverlayLayerClass;

});
