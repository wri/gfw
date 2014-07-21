/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/AnalysisToolPresenter',
  'text!templates/analysisTool.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

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
      AnalysisToolView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      AnalysisToolView.__super__._cacheSelector.apply(this);
      this.$cancel = this.$el.find('#cancel');
      this.$done = this.$el.find('#done');
    },

    _startDrawing: function() {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        polygonOptions: {
          strokeWeight: 2,
          fillOpacity: 0.45,
          fillColor: "#FFF",
          strokeColor: "#A2BC28",
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
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setMap(null);
      this.selection && this.selection.setEditable(false);
    },

    _onOverlayComplete: function(e) {
      self = this;
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        this._stopDrawing();
        this._setSelection(e.overlay, e.type);
      }

      this.polygon = JSON.stringify({
        'type': 'Polygon',
        'coordinates': _.map(e.overlay.getPath().getArray(),
          function(latlng, index) {
            return [latlng.lng().toFixed(4), latlng.lat().toFixed(4)];
          })
      });

      console.log(this.polygon);
      this.polygon && this.$done.removeClass('disabled');
    },

    _deleteSelection: function() {
      if(this.selection) {
        this.selection.setMap(null);
        this.selection = null;
      }
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

    // Publish polygon
    _onClickDone: function() {
      this.presenter.publishAnalysis(this.polygon);
      this._stopDrawing();
      this.model.set({boxHidden: true});
    },

    _onClickCancel: function() {
      this._stopDrawing();
      this._deleteSelection();
      this.model.set({boxHidden: true});
    },

    _onClickBtn: function(e) {
      this._startDrawing(e);
      this._toggleBoxHidden(e);
    }

  });

  return AnalysisToolView;

});
