
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
      this.status.on('change:geojson', this.changeGeojson.bind(this));
      this.status.on('change:geostore', this.changeGeostore.bind(this));

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

    changeGeojson: function() {
      var geojson = this.status.get('geojson');
      if (!!geojson) {
        GeostoreService.save(geojson).then(function(geostoreId) {
          this.status.set('geostore', geostoreId);
        }.bind(this));
      } else {
        this.status.set('geostore', null);
      }
    },

    changeGeostore: function() {
      mps.publish('Drawing/geostore', [this.status.get('geostore')]);
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
      this.status.set('overlay', e.overlay);

      // Check if the drawing is enabled
      if (this.status.get('is_drawing')) {
        this.status.set('geojson', this.getGeojson(e.overlay));

        this.eventsDrawing();
        mps.publish('Drawing/toggle', [false]);
      } else {
        this.deleteDrawing();
      }

      this.stopDrawingManager();
    },

    /**
     * updateDrawing
     * @param  {[object]} overlay
     * @return {void}
     */
    updateDrawing: function(overlay) {
      this.status.set('overlay', overlay);
      this.status.set('geojson', this.getGeojson(overlay));
    },

    /**
     * deleteDrawing
     * @return {void}
     */
    deleteDrawing: function() {
      var overlay = this.status.get('overlay');
      if (!!overlay) {
        overlay.setMap(null);
        this.status.set('overlay', null);
        this.status.set('geojson', null);
      }
    },

    /**
     * eventsDrawing
     * @return {void}
     */
    eventsDrawing: function() {
      var overlay = this.status.get('overlay');

      google.maps.event.addListener(overlay.getPath(), 'set_at', function () {
        this.updateDrawing(overlay);
      }.bind(this));

      google.maps.event.addListener(overlay.getPath(), 'insert_at', function () {
        this.updateDrawing(overlay);
      }.bind(this));

      google.maps.event.addListener(overlay.getPath(), 'remove_at', function () {
        this.updateDrawing(overlay);
      }.bind(this));
    },


    /**
     * HELPERS
     * getGeojson
     * @param  {object} overlay
     * @return {object:geojson}
     */
    getGeojson: function(overlay) {
      var paths = overlay.getPath().getArray();
      return geojsonUtilsHelper.pathToGeojson(paths);
    },


    /**
     * drawGeojson
     * @param  {object:geojson} geojson
     * @return {void}
     */
    drawGeojson: function(geojson) {
      var paths = geojsonUtilsHelper.geojsonToPath(geojson);
      var overlay = new google.maps.Polygon({
        paths: paths,
        editable: (geojson.type == 'Polygon'),
        strokeWeight: this.status.get('overlay_stroke_weight'),
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);

      this.status.set('overlay', overlay, { silent: true });
      this.status.set('geojson', this.getGeojson(overlay), { silent: true });

      this.eventsDrawing();

      if (this.status.get('fit_to_geom')) {
        this.map.fitBounds(overlay.getBounds());
      }
    }



  });

  return MapMiniDrawingView;

});
