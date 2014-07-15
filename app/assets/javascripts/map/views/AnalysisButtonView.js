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
    initialize: function(options) {
      _.bindAll(this, '_onOverlayComplete');
      this.options   = options;
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

    hideHelperBar: function() {
      this.$el.find('.helper_bar').fadeOut();
    },

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

    _onOverlayComplete: function(e) {
      var polygon = {};
      
      polygon = JSON.stringify({
        'type': 'Polygon',
        'coordinates': $.map(e.overlay.getPath().getArray(), function(latlng, index) {
                            return [[latlng.lng().toFixed(4), latlng.lat().toFixed(4)]];
                        })
      });

      if (polygon) {
        var config = {dataset: 'forma-alerts', geojson: polygon};
        var callback = this.hideHelperBar();
        //service.execute(config,callback);
        
        return;
      }
    },
  });

  return AnalysisButtonView;

});
