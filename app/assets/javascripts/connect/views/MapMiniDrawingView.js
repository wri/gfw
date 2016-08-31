
/**
 * The MapMiniDrawingView view.
 *
 * @return MapMiniDrawingView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'amplify',
  'turf',
  'mps',
  'map/services/GeostoreService',
  'helpers/geojsonUtilsHelper',
], function(_, Handlebars, amplify, turf, mps, GeostoreService, geojsonUtilsHelper) {

  'use strict';

  var MapMiniDrawingView = Backbone.View.extend({

    el: '#map-drawing',

    events: {
      'click' : 'onClickDrawing'
    },

    status: new (Backbone.Model.extend({
      defaults: {
        is_drawing: false,
        geosjon: null,
        overlay: null,
        overlay_stroke_weight: 2
      }
    })),

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      this.map = map;
      this.listeners();
    },

    listeners: function() {
      // Status listeners
      this.status.on('change:is_drawing', this.changeIsDrawing.bind(this));

      // MPS listeners
      mps.subscribe('Drawing/toggle', function(toggle){
        this.status.set('is_drawing', toggle);
      }.bind(this))
    },


    // CHANGE EVENTS
    changeIsDrawing: function() {
      var is_drawing = this.status.get('is_drawing');
      this.setDrawingButton();

      if (is_drawing) {
        this.$el.text('Cancel');
        this.startDrawingManager();
      } else {
        this.$el.text('Start drawing');
        this.stopDrawingManager();
      }
    },

    setDrawingButton: function() {
      var is_drawing = this.status.get('is_drawing');
      this.$el.toggleClass('-drawing', is_drawing);
    },

    /**
     * DRAWING MANAGER
     * - onClickDrawing
     */
    onClickDrawing: function(e) {
      e && e.preventDefault();
      var is_drawing = $(e.currentTarget).hasClass('-drawing');
      mps.publish('Drawing/toggle', [!is_drawing]);
    },


    /**
     * DRAWING MANAGER
     *
     * startDrawingManager
     * @return {void}
     */
    startDrawingManager: function() {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        map: this.map,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        polygonOptions: {
          editable: true,
          strokeWeight: 2,
          fillOpacity: 0,
          fillColor: '#FFF',
          strokeColor: '#A2BC28',
        },
        panControl: false,
      });

      // Bindings
      $(document).on('keyup.drawing', function(e){
        if (e.keyCode == 27) {
          mps.publish('Drawing/toggle', [false]);
        }
      }.bind(this));

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.completeDrawing.bind(this));
    },

    /**
     * stopDrawingManager
     * @return {void}
     */
    stopDrawingManager: function() {
      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
        this.drawingManager.setMap(null);
      }

      // Bindings
      $(document).off('keyup.drawing');
      google.maps.event.clearListeners(this.drawingManager, 'overlaycomplete');
    },

    /**
     * completeDrawing
     * @param  {[object]} e
     * @return {void}
     */
    completeDrawing: function(e) {
      // Check if the drawing is enabled
      if (this.status.get('is_drawing')) {
        mps.publish('Drawing/overlay', [e.overlay]);
        mps.publish('Drawing/toggle', [false]);
      } else {
        mps.publish('Drawing/delete');
      }

      this.stopDrawingManager();
    },

  });

  return MapMiniDrawingView;

});
