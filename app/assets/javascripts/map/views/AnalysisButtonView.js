/**
 * The AnalysisButtonView class for enabling analysis on the map.
 *
 * @return AnalysisButton class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/AnalysisButtonPresenter',
  'handlebars',
  'text!templates/AnalysisButtonTemplate.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var AnalysisButtonView = Backbone.View.extend({

    // UI event handlers.
    events: {
      'click #analysis_control'  : '_onClick',
      'click .helper_bar .done'  : 'onClickDone',
      'click .helper_bar .cancel': 'onClickCancel'
    },

    // The view template.
    template: Handlebars.compile(tpl),

    /**
     * Constructs a new AnalysisButtonView and its presenter.
     */
    initialize: function(options) {
      _.bindAll(this, '_onOverlayComplete');
      this.options   = options;
      this.presenter = new Presenter(this);
      this.polygon = false;
      this.selectedShape = false;
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    },

    /**
     * Click handler that delegates to the presenter.
     *
     * @param  {Event} e The click event
     */
    _onClick: function(e) {
      e && e.preventDefault();
      var $control = this._getControl();
      if ($control.hasClass('disabled')) return;
      
      this.presenter.onClick();
    },

    /**
     * Returns jQuery object representing the #analysis_control DOM element.
     * It's an optimization to avoid calling the jQuery selector multiple
     * times.
     *
     * @return {jQuery} The #analysis_control jQuery object
     */
    _getControl: function() {
      if (!this.control) {
        this.control = this.$('#analysis_control');
      }
      return this.control;
    },

    /**
     * Enable or disable the view.
     *
     * @param {Boolean} enable True to enable view, false to disable it.
     */
    setEnabled: function(enable) {
      var $control = this._getControl();

      if (enable) {
        $control.removeClass('disabled');
      } else {
        $control.addClass('disabled');
      }
    },

    /**
     * Shows the bottom bar with the buttons and enable drawing.
     */
    showHelperBar: function() {
      var self = this;
      $('.timeline').fadeOut(function(){
        self.$el.find('.helper_bar').fadeIn();
        self.startDrawingManager()
      })
    },

    /**
     * Fades out the bottom bar with the buttons.
     */
    hideHelperBar: function() {
      this.$el.find('.helper_bar').fadeOut();
    },

    /**
     * Enables 'Done' button on helperbar.
     */
    enableDoneButton: function(e) {
      e && e.preventDefault();
      this.$el.find('.helper_bar .done').removeClass('disabled');
    },

    /**
     * Throws analysis requests for thr chosen polygon through the presenter 
     * method and fades out the helper bar.
     */
    onClickDone: function() {
      this.presenter.requestAnalysis(this.polygon);
      this.hideHelperBar();
    },

    /**
     * Deletes the drawn shapes (if exist) and fades out the helper bar.
     */
    onClickCancel: function(e) {
      e && e.preventDefault();
      this.deleteSelectedShape();
      this.hideHelperBar();
    },

    /**
     * Allow draw a shape with Google Maps V3 Drawing Tools.
     *
     * @return {Google Maps} drawingManager object
     * @callback _onOverlayComplete
     */
    startDrawingManager: function() {
      var options = {
        drawingModes: [ google.maps.drawing.OverlayType.POLYGON ],
        drawingControl: false,
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
        map: this.options.map
      };

      this.drawingManager = new google.maps.drawing.DrawingManager(options);
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this._onOverlayComplete);
    },


    /**
    * Clears the selected dhape on the map
    */
    clearSelection: function() {
      if (this.selectedShape) {
        this.selectedShape.setEditable(false);
        this.selectedShape = null;
      }
    },

    /**
    * Allows the seleceted object to be managed
    */
    setSelection: function(shape) {
      this.clearSelection();
      this.selectedShape = shape;
      shape.setEditable(true);
    },

    /**
    * Destroy the selected shape permanently
    */
    deleteSelectedShape: function() {
      if (this.selectedShape) {
        this.selectedShape.setMap(null);
        this.selectedShape = false;
      }
    },

    /**
     * Construct the query to analyze
     *
     * @param {Shape object} e with the drawn shape.
     */
    _onOverlayComplete: function(e) {
      self = this;
      if (e.type != google.maps.drawing.OverlayType.MARKER) {

        // Switch back to non-drawing mode after drawing a shape.
        this.drawingManager.setDrawingMode(null);

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;
        google.maps.event.addListener(newShape, 'click', function() {
          self.setSelection(newShape);
        });
        this.setSelection(newShape);
      }

      this.polygon = JSON.stringify({
        'type': 'Polygon',
        'coordinates': $.map(e.overlay.getPath().getArray(), function(latlng, index) {
                            return [[latlng.lng().toFixed(4), latlng.lat().toFixed(4)]];
                        })
      });

      if (this.polygon) {
        this.enableDoneButton();
        return;
      }
    },
  });

  return AnalysisButtonView;

});
