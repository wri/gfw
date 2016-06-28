/**
 * The AnalysisDrawView selector view.
 *
 * @return AnalysisDrawView instance (extends Backbone.View).
 */
define([
  'underscore', 
  'handlebars', 
  'amplify', 
  'turf', 
  'mps',
  'helpers/geojsonUtilsHelper',
  'map/presenters/analysis/AnalysisDrawPresenter',
  'text!map/templates/analysis/analysis-draw.handlebars',
  // 'map/services/ShapefileService',
  // 'helpers/geojsonUtilsHelper',
], function(_, Handlebars, amplify, turf, mps, geojsonUtilsHelper, Presenter, tpl) {

  'use strict';

  var AnalysisDrawView = Backbone.View.extend({

    el: '#analysis-draw-tab',

    template: Handlebars.compile(tpl),

    model: new (Backbone.Model.extend({
      geojson: null,
      is_drawing: false,
      overlay: null
    })),

    events: {
      //draw
      'click #btn-start-drawing' : 'onClickStartDrawing',
    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      this.render();
      this.listeners();
      // this.setDropable();
    },

    render: function(){
      this.$el.html(this.template());
      this.cache();
    },

    cache: function(){
      this.$btnStartDrawing = this.$el.find('#btn-start-drawing');
    },

    listeners: function() {
      this.model.on('change:geojson', this.changeGeojson.bind(this));
      this.model.on('change:is_drawing', this.changeIsDrawing.bind(this));
    },






    /**
     * UI EVENTS
     * 
     * onClickStartDrawing
     * @param  {[object]} e
     * @return {void}
     */
    onClickStartDrawing: function(e) {
      e && e.preventDefault();

      if (!this.model.get('is_drawing')) {
        this.model.set('is_drawing', true);
        ga('send', 'event', 'Map', 'Analysis', 'Click: start');

      } else {
        this.model.set('is_drawing', false);
        this.presenter.deleteAnalysis();        
        ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
      }
    },






    /**
     * LISTENERS
     * 
     * changeIsDrawing
     * @return {void}
     */    
    changeIsDrawing: function() {
      var is_drawing = this.model.get('is_drawing');
      if (is_drawing) {
        this.$btnStartDrawing.removeClass('green').addClass('gray').text('Cancel');
        this.startDrawingManager();
      } else {
        this.$btnStartDrawing.removeClass('gray').addClass('green').text('Start drawing');
        this.stopDrawingManager();
      }

      // TO-DO: We should improve this...
      // We are handling the tooltip buttons here
      // $('.cartodb-popup').toggleClass('dont_analyze', !!is_drawing);
    },

    /**
     * changeGeojson
     * @return {void}
     */
    changeGeojson: function() {
      var geojson = this.model.get('geojson');
      this.presenter.storeGeojson(geojson);
    },






    /**
     * DRAWING MANAGER
     *
     * startDrawingManager
     * @return {void}
     */
    startDrawingManager: function() {
      this.presenter.startDrawing();

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
          this.model.set('is_drawing', false);
          this.presenter.deleteAnalysis();
          ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
        }
      }.bind(this));

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.completeDrawing.bind(this));      
    },

    /**
     * stopDrawingManager
     * @return {void}
     */
    stopDrawingManager: function() {
      this.presenter.stopDrawing();

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
      this.model.set('overlay', e.overlay);

      // Check if the drawing is enabled
      if(this.model.get('is_drawing')) {      
        this.model.set('geojson', this.getGeojson(e.overlay));
        
        this.eventsDrawing();

        ga('send', 'event', 'Map', 'Analysis', 'Polygon: complete');
      }

      this.stopDrawingManager();
    },

    /**
     * updateDrawing
     * @param  {[object]} overlay
     * @return {void}
     */
    updateDrawing: function(overlay) {
      this.model.set('overlay', overlay);
      this.model.set('geojson', this.getGeojson(overlay));
    },

    /**
     * deleteDrawing
     * @return {void}
     */
    deleteDrawing: function() {
      var overlay = this.model.get('overlay');
      if (!!overlay) {        
        overlay.setMap(null);
        this.model.set('overlay', null);
        this.model.set('geojson', null);
      }
    },

    /**
     * eventsDrawing
     * @return {void}
     */
    eventsDrawing: function() {
      var overlay = this.model.get('overlay');

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
      var paths = geojsonUtilsHelper.geojsonToPath(geojson.features[0].geometry);
      var overlay = new google.maps.Polygon({
        paths: paths,
        editable: true,
        strokeWeight: 2,
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);
      
      this.model.set('overlay', overlay, { silent: true });
      this.model.set('geojson', this.getGeojson(overlay), { silent: true });

      this.eventsDrawing();
    }

  });

  return AnalysisDrawView;

});
