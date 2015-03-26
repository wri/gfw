/**
 * The MapControlsView view.
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'keymaster',
  'map/presenters/MapControlsPresenter',
  'map/views/controls/SearchboxView',
  'map/views/controls/ToggleModulesView',
  'views/ShareView',
  'map/views/controls/ThresholdView',
  'text!map/templates/mapcontrols.handlebars'
], function(_, Handlebars, keymaster, Presenter, Searchbox, ToggleModulesView, ShareView, ThresholdView, tpl) {

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
      'click .share-map' : 'shareMap',
      'click .toggle-modules' : 'toggleModules',
    },

    template: Handlebars.compile(tpl),

    initialize: function(map) {
      _.bindAll(this,'zoomIn','zoomOut','resetMap','showSearch','shareMap','toggleModules');
      this.model = new MapControlsModel();
      this.presenter = new Presenter(this);
      this.map = map;
      this.render();
      this.setListeners();
    },

    setListeners: function(){
      key('s', this.showSearch);
      key('m', this.zoomIn);
      key('n', this.zoomOut);
      key('alt+r', this.resetMap);
      key('f', this.shareMap);
      key('t', this.toggleModules);

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
      this.$el.html(this.template({embedUrl: this._generateEmbedUrl()}));
      this.initCustomViews();
    },

    initCustomViews: function(){
      new Searchbox(this.map);
      new ToggleModulesView();
      new ThresholdView();
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

    //SHARE
    shareMap: function(event) {
      new ShareView().share(event);
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
      this.$el.find('.toggle-modules').toggleClass('active');
      mps.publish('MapControlsToggleModules/toggle');
    },

    _generateEmbedUrl: function() {
      return window.location.origin + '/embed' + window.location.pathname + window.location.search;
    }
  });

  return MapControlsView;

});
