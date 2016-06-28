/**
 * The AnalysisDrawView selector view.
 *
 * @return AnalysisDrawView instance (extends Backbone.View).
 */
define([
  'underscore', 
  'handlebars', 
  'amplify', 
  'chosen', 
  'turf', 
  'mps',
  'helpers/geojsonUtilsHelper',
  'map/presenters/analysis/AnalysisDrawPresenter',
  'text!map/templates/analysis/analysis-draw.handlebars',
  // 'map/services/ShapefileService',
  // 'helpers/geojsonUtilsHelper',
], function(_, Handlebars, amplify, chosen, turf, mps, geojsonUtilsHelper, Presenter, tpl) {

  'use strict';

  var AnalysisDrawView = Backbone.View.extend({

    el: '#analysis-draw-tab',

    template: Handlebars.compile(tpl),

    model: new (Backbone.Model.extend({
      geostore: null,
      is_drawing: false,
      geojson: null
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
        ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
      }
    },


    /**
     * LISTENERS
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

        // delete polygon...
        debugger;
        this.map.data
      }

      // TO-DO: We should improve this...
      // We are handling the tooltip buttons here
      // $('.cartodb-popup').toggleClass('dont_analyze', !!is_drawing);
    },

    /**
     * changeGeojson
     * store the geojson
     * @return {void}
     */
    changeGeojson: function() {
      console.log(this.model.get('geojson'));
      this.presenter.storeGeojson(this.model.get('geojson'));
    },


    /**
     * DRAWING MANAGER
     * startDrawingManager
     * @param  {[object]} e
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
          ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
        }
      }.bind(this));

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.completeDrawing.bind(this));      
    },

    stopDrawingManager: function() {
      this.presenter.stopDrawing();

      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
        this.drawingManager.setMap(null);
      }
      // Bindings
      $(document).off('keyup.drawing');
    },

    completeDrawing: function(e) {
      this.stopDrawingManager();
      this.eventsDrawing(e);

      this.model.set('geojson', e);

      ga('send', 'event', 'Map', 'Analysis', 'Polygon: complete');
    },

    eventsDrawing: function(e) {
      google.maps.event.addListener(e.overlay.getPath(), 'set_at', function () {
        console.log(arguments);
        // this._updateAnalysis();
      }.bind(this));      

      google.maps.event.addListener(e.overlay.getPath(), 'insert_at', function () {
        console.log(arguments);
        // this._updateAnalysis();
      }.bind(this));

      google.maps.event.addListener(e.overlay.getPath(), 'remove_at', function () {
        console.log(arguments);
        // this._updateAnalysis();
      }.bind(this));
    },




    // setDropable: function() {
    //   var dropable = document.getElementById('drop-shape-analysis'),
    //       fileSelector = document.getElementById('analysis-file-upload');
    //   if (!dropable) { return; }

    //   var handleUpload = function(file) {
    //     var FILE_SIZE_LIMIT = 1000000,
    //         sizeMessage = 'The selected file is quite large and uploading it might result in browser instability. Do you want to continue?';
    //     if (file.size > FILE_SIZE_LIMIT && !window.confirm(sizeMessage)) {
    //       $(dropable).removeClass('moving');
    //       return;
    //     }

    //     mps.publish('Spinner/start', []);

    //     var shapeService = new ShapefileService({ shapefile: file });
    //     shapeService.toGeoJSON().then(function(data) {
    //       var combinedFeatures = data.features.reduce(turf.union);

    //       mps.publish('Analysis/upload', [combinedFeatures.geometry]);

    //       this.drawMultipolygon(combinedFeatures);
    //       var bounds = geojsonUtilsHelper.getBoundsFromGeojson(combinedFeatures);
    //       this.map.fitBounds(bounds);
    //     }.bind(this));

    //     $(dropable).removeClass('moving');
    //   }.bind(this);

    //   fileSelector.addEventListener('change', function() {
    //     var file = this.files[0];
    //     if (file) { handleUpload(file); }
    //   });

    //   dropable.addEventListener('click', function(event) {
    //     var $el = $(event.target);
    //     if ($el.hasClass('source')) { return true; }

    //     $(fileSelector).trigger('click');
    //   });

    //   dropable.ondragover = function () { $(dropable).toggleClass('moving'); return false; };
    //   dropable.ondragend = function () { $(dropable).toggleClass('moving'); return false; };
    //   dropable.ondrop = function (e) {
    //     e.preventDefault();
    //     var file = e.dataTransfer.files[0];
    //     handleUpload(file);
    //     return false;
    //   };

    // },

    // /**
    //  * Set geojson style.
    //  */
    // setStyle: function() {
    //   this.style = {
    //     strokeWeight: 2,
    //     fillOpacity: 0,
    //     fillColor: '#FFF',
    //     strokeColor: '#A2BC28',
    //   };

    //   this.map.data.setStyle(_.bind(function(feature){
    //     var strokeColor = (feature.getProperty('color')) ? feature.getProperty('color') : '#A2BC28';
    //     return ({
    //       strokeWeight: 2,
    //       fillOpacity: 0,
    //       fillColor: '#FFF',
    //       strokeColor: strokeColor
    //     });
    //   }, this ));
    // },

    /**
     * DRAWING
     */
    /**
     * Triggered when the user clicks on the analysis draw button.
     */
    // _onClickAnalysis: function() {
    //   if (!this.$start.hasClass('in_use')) {
    //     ga('send', 'event', 'Map', 'Analysis', 'Click: start');
    //     this.toggleUseBtn(true);
    //     this._startDrawingManager();
    //     this.presenter.startDrawing();
    //   }else{
    //     ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
    //     this._stopDrawing();
    //     this.presenter.deleteAnalysis();
    //   }
    // },

    // /**
    //  * Triggered when the user complete a polygon 
    //  * or change it with the drawing manager.
    //  */
    // _updateAnalysis: function() {
    //   this._stopDrawing();
    //   this.presenter.doneDrawing();
    //   this.toggleAnalysis(true);
    // },

    // /**
    //  * Star drawing manager and add an overlaycomplete
    //  * listener.
    //  */
    // _startDrawingManager: function() {
    //   this.presenter.deleteMultiPoligon();
    //   this.model.set('is_drawing', true);
    //   this.drawingManager = new google.maps.drawing.DrawingManager({
    //     drawingControl: false,
    //     drawingMode: google.maps.drawing.OverlayType.POLYGON,
    //     polygonOptions: _.extend({
    //       editable: true
    //     }, this.style),
    //     panControl: false,
    //     map: this.map
    //   });

    //   $(document).on('keyup.drawing', function(e){
    //     if (e.keyCode == 27) {
    //       this._stopDrawing();
    //       this.presenter.deleteAnalysis();
    //     }
    //   }.bind(this));

    //   // cache cartodb infowindows
    //   this.$infowindows = $('.cartodb-infowindow');
    //   this.$infowindows.addClass('hidden');


    //   google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this._onOverlayComplete);
    // },

    // /**
    //  * Triggered when the user finished drawing a polygon.
    //  *
    //  * @param  {Object} e event
    //  */
    // _onOverlayComplete: function(e) {
    //   ga('send', 'event', 'Map', 'Analysis', 'Polygon: complete');
    //   this.presenter.onOverlayComplete(e);
    //   this._resetDrawing();
    //   this._updateAnalysis();

    //   this.presenter.setDontAnalyze(true);
    //   this.setEditableEvents(e.overlay);
    // },

    // /**
    //  * Stop drawing manager, set drawing box to hidden.
    //  */
    // _stopDrawing: function() {
    //   this.presenter.stopDrawing();
    //   this._resetDrawing();
    //   // buttons clases
    //   this.toggleUseBtn(false);
    //   // Remove binds
    //   $(document).off('keyup.drawing');

    // },

    // _resetDrawing: function(){
    //   this.model.set('is_drawing', false);
    //   if(this.$infowindows)
    //     this.$infowindows.hide(0).removeClass('hidden');
    //   if (this.drawingManager) {
    //     this.drawingManager.setDrawingMode(null);
    //     this.drawingManager.setMap(null);
    //   }
    // },

    // /**
    //  * Deletes a overlay from the map.
    //  *
    //  * @param  {object} resource overlay/multipolygon
    //  */
    // deleteGeom: function(resource) {
    //   if (resource.overlay) {
    //     resource.overlay.setMap(null);
    //     resource.overlay = null;
    //   }

    //   if (resource.multipolygon) {
    //     this.map.data.remove(resource.multipolygon);
    //   }

    //   this._removeCartodblayer();
    //   this.$tabs.removeClass('disabled');
    // },

    // setEditable: function(overlay, to) {
    //   overlay.setEditable(to);
    // },

    // setEditableEvents: function(overlay) {
    //   google.maps.event.addListener(overlay.getPath(), 'set_at', function () {
    //     this._updateAnalysis();
    //   }.bind(this));      

    //   google.maps.event.addListener(overlay.getPath(), 'insert_at', function () {
    //     this._updateAnalysis();
    //   }.bind(this));

    //   google.maps.event.addListener(overlay.getPath(), 'remove_at', function () {
    //     this._updateAnalysis();
    //   }.bind(this));
    // },

    // /**
    //  * Draw Geojson polygon on the map.
    //  *
    //  * @param  {String} geojson Geojson polygon as a string
    //  */
    // drawPaths: function(paths) {
    //   var overlay = new google.maps.Polygon(
    //     _.extend({}, {paths: paths, editable: true}, this.style));

    //   overlay.setMap(this.map);
    //   this.presenter.setOverlay(overlay);
    //   this.setEditableEvents(overlay);
    // },

    // /**
    //  * Draw a multypoligon on the map.
    //  *
    //  * @param  {Object} topojson
    //  */
    // drawMultipolygon: function(geojson) {
    //   var multipolygon = this.map.data.addGeoJson(geojson)[0];
    //   this.map.data.addListener("click", function(e){
    //       google.maps.event.trigger(this.map, 'click', e);
    //   }.bind(this));
    //   this.setStyle();
    //   this.presenter.setMultipolygon(multipolygon, geojson);
    // },

  });
  return AnalysisDrawView;

});
