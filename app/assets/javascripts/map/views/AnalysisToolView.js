/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'd3',
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/AnalysisToolPresenter',
  'text!map/templates/analysisTool.handlebars'
], function(d3, _, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var AnalysisToolView = Widget.extend({

    className: 'widget widget-analysis-tool',

    template: Handlebars.compile(tpl),

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false,
      boxDraggable: false
    },

    events: function(){
      return _.extend({}, AnalysisToolView.__super__.events, {
        'click #analysis': 'onClickAnalysis',
        'click #done': '_onClickDone',
        'click #cancel': '_onClickCancel'
      });
    },

    initialize: function(map) {
      _.bindAll(this, '_onOverlayComplete');
      this.map = map;
      this.presenter = new Presenter(this);
      this._setStyle();
      AnalysisToolView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      AnalysisToolView.__super__._cacheSelector.apply(this);
      this.$cancel = this.$el.find('#cancel');
      this.$done = this.$el.find('#done');
    },

    /**
     * Triggered when the user clicks on the analysis button.
     */
    onClickAnalysis: function() {
      this._startDrawingManager();
      this.presenter.startDrawing();
      this.model.set('boxHidden', false);
      this.$done.addClass('disabled');
      this.toggleWidgetBtn(true);
      ga('send', 'event', 'Map', 'Analysis', 'Perform an analysis');
    },

    /**
     * Star drawing manager and add an overlaycomplete
     * listener.
     */
    _startDrawingManager: function() {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        polygonOptions: _.extend({
          editable: true
        }, this.style),
        panControl: false,
        map: this.map
      });
      // cache cartodb infowindows
      this.$infowindows = $('.cartodb-infowindow');
      this.$infowindows.addClass('hidden');


      google.maps.event.addListener(this.drawingManager,
        'overlaycomplete', this._onOverlayComplete);
    },

    /**
     * Triggered when the user finished drawing a polygon.
     *
     * @param  {Object} e event
     */
    _onOverlayComplete: function(e) {
      this.presenter.onOverlayComplete(e);
      this.$done.removeClass('disabled');
    },

    /**
     * Triggered when the user clicks on done
     * to get the analysis of the new polygon.
     */
    _onClickDone: function() {
      this.$infowindows.hide(0).removeClass('hidden');
      this._stopDrawing();
      this.presenter.doneDrawing();
    },

    /**
     * Triggered when the user clicks on cancel
     * to stop drawing a polygon.
     */
    _onClickCancel: function() {
      this._stopDrawing();
      this.presenter.deleteAnalysis();
    },

    /**
     * Stop drawing manager, set drawing box to hidden.
     */
    _stopDrawing: function() {
      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
        this.drawingManager.setMap(null);
      }

      this.model.set({boxHidden: true});
      this.presenter.stopDrawing();
    },

    /**
     * Deletes a overlay from the map.
     *
     * @param  {object} resource overlay/multipolygon
     */
    deleteGeom: function(resource) {
      if (resource.overlay) {
        resource.overlay.setMap(null);
        resource.overlay = null;
      }

      if (resource.multipolygon) {
        this.map.data.remove(resource.multipolygon);
      }
    },

    setEditable: function(overlay, to) {
      overlay.setEditable(to);
    },

    /**
     * Draw Geojson polygon on the map.
     *
     * @param  {String} geojson Geojson polygon as a string
     */
    drawPaths: function(paths) {
      var overlay = new google.maps.Polygon(
        _.extend({}, {paths: paths}, this.style));

      overlay.setMap(this.map);
      this.presenter.setOverlay(overlay);
    },

    /**
     * Draw a multypoligon on the map.
     *
     * @param  {Object} topojson
     */
    drawMultipolygon: function(geojson) {
      var multipolygon = this.map.data.addGeoJson(geojson)[0];
      this.presenter.setMultipolygon(multipolygon, geojson);
    },

    toggleWidgetBtn: function(to) {
      this.$widgetBtn.toggleClass('disabled', to);
    },

    /**
     * Set geojson style.
     */
    _setStyle: function() {
      this.style = {
        strokeWeight: 2,
        fillOpacity: 0.45,
        fillColor: '#FFF',
        strokeColor: '#A2BC28',
        icon: new google.maps.MarkerImage(
          '/assets/icons/marker_exclamation.png',
          new google.maps.Size(36, 36), // size
          new google.maps.Point(0, 0), // offset
          new google.maps.Point(18, 18) // anchor
        )
      };

      this.map.data.setStyle(this.style);
    }

  });

  return AnalysisToolView;

});

