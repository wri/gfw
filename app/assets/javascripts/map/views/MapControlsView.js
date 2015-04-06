/**
 * The MapControlsView view.
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'keymaster',
  'map/presenters/MapControlsPresenter',
  'map/views/controls/SearchboxView',
  'map/views/controls/ToggleModulesView',
  'views/ShareView',
  'map/views/controls/ThresholdView',
  'text!map/templates/mapcontrols.handlebars',
  'text!map/templates/mapcontrols-mobile.handlebars'
], function(_, Handlebars, enquire, keymaster, Presenter, Searchbox, ToggleModulesView, ShareView, ThresholdView, tpl, tplMobile) {

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
      'click .locate' : 'locateMeOnMap',
      'click .toggle-modules' : 'toggleModules',
      'click .toggle-mapcontrols' : 'toggleControls'
    },

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    initialize: function(map) {
      _.bindAll(this,'zoomIn','zoomOut','resetMap','showSearch','shareMap','toggleModules');
      this.model = new MapControlsModel();
      this.presenter = new Presenter(this);
      this.map = map;
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(false);
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(true);
        },this)
      });

      this.cacheVars();
      this.setListeners();
    },

    cacheVars: function(){
      this.$toggleButtons = this.$el.find('.toggle-buttons');
    },

    setListeners: function(){
      key('f', this.showSearch);
      key('m', this.zoomIn);
      key('n', this.zoomOut);
      key('alt+r', this.resetMap);
      key('s', this.shareMap);
      key('h', this.toggleModules);

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

    render: function (mobile) {
      if (mobile) {
        this.$el.html(this.templateMobile({embedUrl: this._generateEmbedUrl()}));
      }else{
        this.$el.html(this.template({embedUrl: this._generateEmbedUrl()}));
      }
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


    // LOCATE ON MAP
    locateMeOnMap: function(){
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          _.bind(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            this.map.setCenter(pos);
          }, this ),
          _.bind(function() {
            this.presenter.notificate('info-example');
          }, this )
        );
      }
    },


    //TOGGLE
    toggleModules: function(e){
      var $button = this.$el.find('.toggle-modules');
      var $tooltip = $button.find('.tooltipmap');
      $button.toggleClass('active');
      ($button.hasClass('active')) ? $tooltip.text('Show windows (t)') : $tooltip.text('Hide windows (t)') ;
      mps.publish('MapControlsToggleModules/toggle');
    },

    toggleControls: function(e){
      this.$toggleButtons.children('.toggle-button').toggleClass('hidden');
    },

    _generateEmbedUrl: function() {
      return window.location.origin + '/embed' + window.location.pathname + window.location.search;
    }
  });

  return MapControlsView;

});
