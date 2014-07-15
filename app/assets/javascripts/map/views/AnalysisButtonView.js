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
      'click #analysis_control': '_onClick'
    },

    // The view template.
    template: Handlebars.compile(tpl),

    /**
     * Constructs a new AnalysisButtonView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
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

    showHelperBar: function() {
      var self = this;
      $('.timeline').fadeOut(function(){
        self.$el.find('.helper_bar').fadeIn();
        self.startDrawingManager()
      })
    },

    startDrawingManager: function() {
      var self = this,
          map = new google.maps.Map(document.getElementById('map'));

      var style = {
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
      };

      var options = {
        drawingModes: [ google.maps.drawing.OverlayType.POLYGON ],
        drawingControl: false,
        polygonOptions: style,
        panControl: false,
        map: map
      };

      // Create the drawing manager
      this.drawingManager = new google.maps.drawing.DrawingManager(options);

      // Start drawing right away
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

      // Event binding
    console.log(google.maps.event)
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this._onOverlayComplete());
    },

    _onOverlayComplete: function(e) {
      var polygon = {};
      var c0 = [];
      var area = null;

      this.drawingManager.setDrawingMode(null);
      this.drawingManager.path = e.overlay.getPath().getArray();
      this.drawingManager.setOptions({ drawingControl: false });
      //this._enableDoneButton();

      var newShape = e.overlay;
      newShape.type = e.type;

      this._setSelection(newShape);

      polygon = {
        'type': 'Polygon',
        'coordinates': [
          $.map(this.drawingManager.path, function(latlong, index) {
            return [[latlong.lng(), latlong.lat()]];
          })
        ]
      };

      if (typeof polygon === 'undefined' || polygon === '' || polygon.coordinates[0].length < 3) {
        this.$('.cancel').click();

        return;
      }

      // Close the polygon:
      c0 = polygon.coordinates[0][0];
      polygon.coordinates[0].push(c0);

      //area = formatNumber(Math.ceil((google.maps.geometry.spherical.computeArea(this.drawingManager.path)/10000) * 10) / 10, true)

      // this.model.set('area', JSON.stringify(polygon));
      // this.info.model.set('ha', formatNumber(this._calcAreaPolygon(polygon), true));
      // this.info.model.set('title', this.info.model.defaults.title);
    },
  });

  return AnalysisButtonView;

});
