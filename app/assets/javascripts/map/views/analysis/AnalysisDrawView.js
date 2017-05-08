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
  'map/services/ShapefileNewService',
  // 'helpers/geojsonUtilsHelper',
], function(_, Handlebars, amplify, turf, mps, geojsonUtilsHelper, Presenter, tpl, ShapefileService) {

  'use strict';

  var AnalysisDrawView = Backbone.View.extend({

    el: '#analysis-draw-tab',

    template: Handlebars.compile(tpl),

    config: {
      FILE_SIZE_LIMIT: 1000000,
      FILE_SIZE_MESSAGE: 'The selected file is quite large and uploading it might result in browser instability. Do you want to continue?',
      FILE_FEATURE_LIMIT: 1000
    },

    events: {
      //draw
      'click #btn-start-drawing' : 'onClickStartDrawing',

      //upload
      'change #file-upload-shape' : 'onChangeFileShape',
      'dragenter' : 'onDragenterShape',
      'dragleave' : 'onDragleaveShape',
      'dragend' : 'onDragendShape',
      'drop' : 'onDropShape'

    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      this.render();
    },

    render: function(){
      this.$el.removeClass('-results').html(this.template());
      this.cache();
    },

    cache: function(){
      // Draw
      this.$btnStartDrawing = this.$el.find('#btn-start-drawing');

      // Upload
      this.$dropable = this.$el.find('#area-dropable-shape');
      this.$uploadLoader = this.$el.find('#area-upload-loader');
      this.$fileSelector = this.$el.find('#file-upload-shape');

      // Map for tooltip
      this.$map = $('#map');
      this.$offset = this.$map.offset();
    },






    /**
     * UI EVENTS
     *
     * - onClickStartDrawing
     * @param  {[object]} e
     * @return {void}
     *
     * - onChangeFileShape
     * @param  {[object]} e
     * @return {void}
     *
     * - onDragoverShape
     * @param  {[object]} e
     * @return {void}
     *
     * - onDragendShape
     * @param  {[object]} e
     * @return {void}
     *
     * - onDropShape
     * @param  {[object]} e
     * @return {void}

     */
    onClickStartDrawing: function(e) {
      e && e.preventDefault();

      if (!this.presenter.status.get('is_drawing')) {
        this.presenter.status.set('is_drawing', true);
        ga('send', 'event', 'Map', 'Analysis', 'Click: start');

      } else {
        this.presenter.status.set('is_drawing', false);
        this.presenter.publishDeleteAnalysis();
        ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
      }
    },

    onChangeFileShape: function(e) {
      var file = e.currentTarget.files[0];
      if (file) {
        this.$dropable.addClass('-moving');

        this.$uploadLoader.addClass('-start');
        this.uploadFile(file);
      }
    },

    onDragenterShape: function(e) {
      this.$dropable.addClass('-moving');
      return false;
    },

    onDragleaveShape: function(e) {
      this.$dropable.removeClass('-moving');
    },

    onDragendShape: function(e) {
      this.$dropable.removeClass('-moving');
      return false;
    },

    onDropShape: function(e, data, clone, element) {
      e && e.preventDefault();
      var file = e.originalEvent.dataTransfer.files[0];
      this.$dropable.addClass('-moving');
      this.$uploadLoader.addClass('-start');
      this.uploadFile(file);
      return false;
    },

    addTooltip: function() {
      this.clickState = 0;
      this.$map.append('<div class="tooltip -enabled">Click to start drawing shape</div>');
      this.$map.mousemove(this.showTooltip.bind(this));
      this.$tooltip = $('.tooltip');
      this.$map.click(this.updateTooltip.bind(this));
    },

    showTooltip: function(e) {
      for (var i = this.$tooltip.length; i--;) {
          this.$tooltip[i].style.left = e.pageX - this.$offset.left + 'px';
          this.$tooltip[i].style.top = e.pageY - this.$offset.top + 'px';
      }
    },

    updateTooltip: function() {
      this.clickState++;
      var newText = '';
      if (this.clickState === 0) {
        newText = 'Click to start drawing shape';
      } else if (this.clickState === 1) {
        newText = 'Continue clicking to draw shape';
      } else if (this.clickState >= 3) {
        newText = 'Click the first point to close shape';
      }
      this.$tooltip.html(newText);

      if (newText !== '') {
        this.$tooltip.addClass('-enabled');
      } else {
        this.$tooltip.removeClass('-enabled');
      }
    },

    removeTooltip: function() {
      this.$tooltip.remove();
      this.$map.off('click');
      this.$map.off('mousemove');
    },




    /**
     * PRESENTER ACTIONS
     *
     * changeIsDrawing
     * @return {void}
     */
    changeIsDrawing: function() {
      var is_drawing = this.presenter.status.get('is_drawing');
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
          this.presenter.status.set('is_drawing', false);
          this.presenter.deleteAnalysis();
          ga('send', 'event', 'Map', 'Analysis', 'Click: cancel');
        }
      }.bind(this));

      this.addTooltip();

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

      this.removeTooltip();

      google.maps.event.clearListeners(this.drawingManager, 'overlaycomplete');
    },

    /**
     * completeDrawing
     * @param  {[object]} e
     * @return {void}
     */
    completeDrawing: function(e) {
      this.presenter.status.set('overlay', e.overlay);

      // Check if the drawing is enabled
      if(this.presenter.status.get('is_drawing')) {
        this.presenter.status.set('geojson', this.getGeojson(e.overlay));

        this.eventsDrawing();
        this.presenter.status.set('is_drawing', false);

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
      this.presenter.status.set('overlay', overlay);
      this.presenter.status.set('geojson', this.getGeojson(overlay));
    },

    /**
     * deleteDrawing
     * @return {void}
     */
    deleteDrawing: function() {
      var overlay = this.presenter.status.get('overlay');
      if (!!overlay) {
        overlay.setMap(null);
        this.presenter.status.set('overlay', null);
        this.presenter.status.set('geojson', null);
      }
    },

    /**
     * eventsDrawing
     * @return {void}
     */
    eventsDrawing: function() {
      var overlay = this.presenter.status.get('overlay');

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
     * UPLOAD FILES
     *
     * - uploadFile
     */
    uploadFile: function(file) {
      if (file.size > this.config.FILE_SIZE_LIMIT && !window.confirm(this.config.FILE_SIZE_MESSAGE)) {
        this.$uploadLoader.removeClass('-start');
        this.$dropable.removeClass('-moving');
        return;
      }

      ShapefileService.save(file)
        .then(function(response) {
            var features = response.data.attributes.features;
            if (!!features && features.length < this.config.FILE_FEATURE_LIMIT) {
              var geojson = features.reduce(turf.union),
              geometry = geojson.geometry;
              this.presenter.status.set({
                geojson: geometry,
                fit_to_geom: true
              });

              this.drawGeojson(geometry);
              ga('send', 'event', 'Map', 'Analysis', 'Upload Shapefile');
            } else {
              this.presenter.publishNotification('notification-over-limit');
            }
            this.$uploadLoader.removeClass('-start');
          // }
        }.bind(this))

        .fail(function(response) {
          var errors = response.errors;
          _.each(errors, function(error){
            if (error.status == 400) {
              if (error.detail.indexOf('ERROR 6') > -1) {
                this.presenter.publishNotification('notification-multilayer-not-supported');
              } else if (error.detail.indexOf('ERROR 4') > -1) {
                this.presenter.publishNotification('notification-file-corrupt');
              } else {
                var error = JSON.parse(error.detail);
                this.presenter.publishCustomNotification('<p>File issue: ' + error.errors[0].detail + '</p>', 'error');
               }
            }
          }.bind(this))
          this.$uploadLoader.removeClass('-start');
        }.bind(this));

      this.$dropable.removeClass('-moving');
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
     * showGeojson
     * @param undefined
     * @return {void}
     */
    showGeojson: function() {
      var overlay = this.presenter.status.get('overlay');
      this.presenter.status.set('overlay_stroke_weight', 2);
      if (!!overlay) {
        overlay.setOptions({ strokeWeight: 2, editable: true});
      }
    },

    /**
     * hideGeojson
     * @param undefined
     * @return {void}
     */
    hideGeojson: function() {
      var overlay = this.presenter.status.get('overlay');
      this.presenter.status.set('overlay_stroke_weight', 0);
      if (!!overlay) {
        overlay.setOptions({ strokeWeight: 0, editable: false});
      }
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
        editable: false,
        strokeWeight: this.presenter.status.get('overlay_stroke_weight'),
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);

      this.presenter.status.set('overlay', overlay, { silent: true });
      this.presenter.status.set('geojson', this.getGeojson(overlay), { silent: true });

      if (this.presenter.status.get('fit_to_geom')) {
        this.map.fitBounds(overlay.getBounds());
      }
    }

  });

  return AnalysisDrawView;

});
