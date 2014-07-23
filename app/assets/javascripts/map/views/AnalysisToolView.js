/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'd3',
  'underscore',
  'handlebars',
  'topojson',
  'views/Widget',
  'presenters/AnalysisToolPresenter',
  'text!templates/analysisTool.handlebars'
], function(d3, _, Handlebars, topojson, Widget, Presenter, tpl) {

  'use strict';

  var AnalysisToolView = Widget.extend({

    className: 'widget widget-analysis-tool',

    template: Handlebars.compile(tpl),

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false
    },

    events: function(){
      return _.extend({}, AnalysisToolView.__super__.events, {
        'click .widget-btn': '_onClickBtn',
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

    _startDrawing: function() {
      this.presenter.startDrawing();
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        polygonOptions: {
          strokeWeight: 2,
          fillOpacity: 0.45,
          fillColor: '#FFF',
          strokeColor: '#A2BC28',
          editable: true,
          icon: new google.maps.MarkerImage(
            '/assets/icons/marker_exclamation.png',
            new google.maps.Size(36, 36), // size
            new google.maps.Point(0, 0), // offset
            new google.maps.Point(18, 18) // anchor
          )
        },
        panControl: false,
        map: this.map
      });

      google.maps.event.addListener(this.drawingManager,
        'overlaycomplete', this._onOverlayComplete);
    },

    _stopDrawing: function() {
      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
        this.drawingManager.setMap(null);
      }
      this.selection && this.selection.setEditable(false);
    },

    _onOverlayComplete: function(e) {
      if (e.type !== google.maps.drawing.OverlayType.MARKER) {
        this._stopDrawing();
        this._setSelection(e.overlay, e.type);
      }

      this.polygon = this.presenter.createGeoJson(e.overlay.getPath().getArray());
      this.$done.removeClass('disabled');
    },

    _clearSelection: function() {
      if(this.selection) {
        this.selection.setEditable(false);
        this.selection = null;
      }
    },

    // Add an event listener that selects the newly-drawn shape when the user
    // mouses down on it.
    _setSelection: function(overlay, type) {
      var shape = overlay;
      shape.type = type;
      this._clearSelection();
      this.selection = shape;
      shape.setEditable(true);
      // google.maps.event.addListener(shape, 'click', function() {
      //   self.setSelection(shape);
      // });
    },

    deleteSelection: function() {
      if(this.selection) {
        this.selection.setMap(null);
        this.selection = null;
      }

      if (this.country) {
        this.map.data.remove(this.country);
      }

      this.$widgetBtn.removeClass('disabled');
    },

    // Publish polygon
    _onClickDone: function() {
      this.presenter.stopDrawing();
      this.presenter.publishAnalysis({geom: this.polygon});
      this._stopDrawing();
      this.model.set({boxHidden: true});
    },

    _onClickCancel: function() {
      this.presenter.stopDrawing();
      this._stopDrawing();
      this.deleteSelection();
      this.model.set({boxHidden: true});
    },

    _onClickBtn: function(e) {
      this._startDrawing(e);
      this._toggleBoxHidden(e);
      this.$widgetBtn.addClass('disabled');
    },

    /**
     * Draw map from coordinates.
     *
     * @param  {object} geom The geom object
     */
    drawGeom: function(geom) {
      var paths = this.presenter.geomToPath(geom);

      this.selection = new google.maps.Polygon(
        _.extend({}, {paths: paths}, this.style));

      this.selection.setMap(this.map);
      this.$widgetBtn.addClass('disabled');
    },

    /**
     * Draw country from multipolygon geojson.
     *
     * @param  {object} topojson
     */
    drawIso: function(tp) {
      var geojson = topojson.feature(tp, tp.objects[0]);
      this.country = this.map.data.addGeoJson(geojson)[0];
      this.map.data.setStyle(this.style);
      this.$widgetBtn.addClass('disabled');
    },

    /**
     * Set polygon and multypoligon style.
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
    }

  });

  return AnalysisToolView;

});

