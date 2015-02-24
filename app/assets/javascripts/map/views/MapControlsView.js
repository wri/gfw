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

  var MapControlsModel = Backbone.Model.extend({
    defaults: {
      hidden: false,
      bounds: null
    }
  });



  var MapControlsView = Backbone.View.extend({

    el: '#module-map-controls',

    events: {
      'click .zoom-in' : 'zoomIn',
      'click .zoom-out' : 'zoomOut',
      'click .reset-map' : 'resetMap',
      'click .search' : 'showSearch',
      'click .fit-bounds' : 'fitBounds',
      'click .toggle-modules' : 'toggleModules',
    },

    template: Handlebars.compile(tpl),

    initialize: function(map) {
      this.model = new MapControlsModel();
      this.presenter = new Presenter(this);
      this.map = map;
      this.render();
      this.setListeners();
    },

    setListeners: function(){

      this.model.on('change:hidden', this.toogleModule, this);

      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onZoomChange();
        }, this)
      );
    },

    toogleModule: function(){
      if(this.model.get('hidden')){
        this.$el.addClass('hide');
      }else{
        this.$el.removeClass('hide');
      }
    },

    render: function(){
      this.$el.html(this.template());
      this.initCustomViews();
    },

    initCustomViews: function(){
      new Searchbox(this.map);
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
    fitBounds: function(){
      if(this.model.get('bounds')){
        this.presenter.fitBounds(this.model.get('bounds'));
      }else{
        this.setZoom(3);
      }
    },

    saveBounds: function(bounds){
      this.model.set('bounds', bounds);
    },

    //TOGGLE
    toggleModules: function(e){
      $(e.currentTarget).toggleClass('active');
      mps.publish('MapControlsToggleModules/toggle');
    },


  });

  return MapControlsView;

});
