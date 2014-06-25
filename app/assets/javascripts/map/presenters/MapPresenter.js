/**
 * The MapPresenter class for the MapView.
 *
 * @return MapPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'collections/layers',
  'views/layers/loss'
], function(Class, _, mps, layers, LossLayer) {

  var MapPresenter = Class.extend({

    /**
     * Constructs new MapPresenter.
     * 
     * @param  {MapView} Instance of MapView
     * 
     * @return {class} The MapPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('Map/set-zoom', _.bind(function(zoom) {
        this.view.setZoom(zoom);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        // TODO
      }, this));  
    },

    onZoomChange: function(zoom) {
      mps.publish('Map/zoom-change', [zoom]);
    },

    onCenterChange: function(lat, lng) {
      mps.publish('Map/center-change', [lat, lng]);
    }

  });

  return MapPresenter;

});