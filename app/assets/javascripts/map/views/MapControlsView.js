/**
 * The MapControlsView view.
 * Hides and shows the widgets displayed on the map
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/MapControlsPresenter',
  'text!map/templates/mapcontrols.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var MapControlsView = Backbone.View.extend({

    el: '#widget-map-controls',

    events: {
      'click .zoom-in' : 'zoomIn',
      'click .zoom-out' : 'zoomOut',
      'click .reset-map' : 'resetMap',
      'click .search' : 'showSearch'
    },

    template: Handlebars.compile(tpl),

    initialize: function(map) {
      this.presenter = new Presenter(this);
      this.map = map;
      this.render();
      this.setListeners();
    },

    setListeners: function(){
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onZoomChange();
          // this.onCenterChange();
        }, this)
      );
    },

    render: function(){
      this.$el.html(this.template());
    },
    /**
     * Events.
     */
    //ZOOM
    zoomIn: function() {
      this.setZoom(this.getZoom() + 1);
    },
    zoomOut: function(){
      this.setZoom(this.getZoom() - 1);
    },
    getZoom: function(){
      return this.map.getZoom();
    },
    setZoom: function(zoom){
      this.map.setZoom(zoom);
    },
    onZoomChange: function() {
      this.presenter.onZoomChange(this.map.zoom);
    },

    //RESET
    resetMap: function(){
      window.location = '/map'
    },

    //SEARCH
    showSearch: function(){
      console.log('hello search');
    }



  });

  return MapControlsView;

});
