/**
 * The MapControlsView view.
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/MapControlsPresenter',
  'map/views/controls/SearchboxView',
  'map/views/controls/ToggleModulesView',
  'text!map/templates/mapcontrols.handlebars'
], function(_, Handlebars, Presenter, Searchbox, ToggleModulesView, tpl) {

  'use strict';

  var MapControlsView = Backbone.View.extend({

    el: '#module-map-controls',

    events: {
      'click .zoom-in' : 'zoomIn',
      'click .zoom-out' : 'zoomOut',
      'click .reset-map' : 'resetMap',
      'click .search' : 'showSearch',
      'click .reset-zoom' : 'resetZoom',
      'click .toggle-modules' : 'toggleModules',
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
        }, this)
      );
    },

    render: function(){
      this.$el.html(this.template());
      this.initCustomViews();
    },

    initCustomViews: function(){
      new Searchbox();
      new ToggleModulesView();
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
      mps.publish('MapControlsSearch/show');
    },

    //RESET ZOOM
    resetZoom: function(){
      this.setZoom(3);
    },

    //TOGGLE
    toggleModules: function(e){
      $(e.currentTarget).toggleClass('active');
      mps.publish('MapControlsToggleModules/toggle');
    },


  });

  return MapControlsView;

});
