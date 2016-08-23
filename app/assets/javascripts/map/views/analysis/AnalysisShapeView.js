/**
 * The AnalysisShapeView selector view.
 *
 * @return AnalysisShapeView instance (extends Backbone.View).
 */
define([
  'underscore', 
  'handlebars', 
  'map/presenters/analysis/AnalysisShapePresenter',
  'text!map/templates/analysis/analysis-shape.handlebars',
  'helpers/geojsonUtilsHelper',

], function(_, Handlebars, Presenter, tpl, geojsonUtilsHelper) {

  'use strict';


  var AnalysisShapeView = Backbone.View.extend({

    el: '#analysis-shape-tab',

    png: '/assets/infowindow-example.png',
    gif: '/assets/infowindow-example.gif',

    template: Handlebars.compile(tpl),

    events: {
      'click #analysis-shape-btn-play' : 'onClickPlay'
    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      this.render();
    },

    render: function(){
      this.$el.removeClass('-results').html(this.template());

      this.cache();
      this.preloadImg(this.gif);
    },

    cache: function() {
      this.$btnPlay = this.$el.find('#analysis-shape-btn-play');
      this.$thumbnail = this.$el.find('#analysis-shape-thumbnail');
    },

    preloadImg: function(url) {
      var img = new Image();
      img.src = url;
    },


    /**
     * UI EVENTS
     * 
     * onClickPlay
     * @param  {object} e
     * @return {void}
     */
    onClickPlay: function(e) {
      this.presenter.status.set('is_playing', true);
    },

    /**
     * PRESENTER ACTIONS
     * 
     * togglePlay
     * @return {void}
     */    
    togglePlay: function() {
      if (!!this.presenter.status.get('is_playing')) {
        this.$btnPlay.addClass('-hidden');
        this.$thumbnail.attr('src',this.gif);
        
        setTimeout(_.bind(function(){
          this.presenter.status.set('is_playing', false)
        }, this ), 7500 );
        
      } else {
        this.$btnPlay.removeClass('-hidden');
        this.$thumbnail.attr('src',this.png);        
      }
    },




    /**
     * HELPERS
     * getGeojson
     * @param  {object} overlay
     * @return {object:geojson}
     */
    getGeojson: function(overlay) {
      var paths = overlay.getPath().getArray();
      return geojsonUtilsHelper.pathToGeojson(paths);            
    },
    
    /**
     * deleteGeojson
     * @param undefined
     * @return {void}
     */
    deleteGeojson: function() {
      var overlay = this.presenter.status.get('overlay_shape');
      if (!!overlay) {        
        overlay.setMap(null);
        this.presenter.status.set('overlay_shape', null);
        this.presenter.status.set('geojson_shape', null);
      }
    },

    /**
     * showGeojson
     * @param undefined
     * @return {void}
     */
    showGeojson: function() {
      var overlay = this.presenter.status.get('overlay_shape');
      this.presenter.status.set('overlay_stroke_weight', 2);
      if (!!overlay) {
        overlay.setOptions({ strokeWeight: 2});
      }
    },

    /**
     * hideGeojson
     * @param undefined
     * @return {void}
     */
    hideGeojson: function() {
      var overlay = this.presenter.status.get('overlay_shape');
      this.presenter.status.set('overlay_stroke_weight', 0);
      if (!!overlay) {
        overlay.setOptions({ strokeWeight: 0});
      }
    },
    
    /**
     * drawGeojson
     * @param  {object:geojson} geojson
     * @return {void}
     */
    drawGeojson: function(geojson) {
      // Delete previous overlay if it exists
      this.deleteGeojson();

      var paths = geojsonUtilsHelper.geojsonToPath(geojson);
      var overlay = new google.maps.Polygon({
        paths: paths,
        editable: false,
        strokeWeight: this.presenter.status.get('overlay_stroke_weight'),
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28'
      });

      overlay.setMap(this.map);
      
      this.presenter.status.set('overlay_shape', overlay, { silent: true });
      this.presenter.status.set('geojson_shape', this.getGeojson(overlay), { silent: true });

      if (this.presenter.status.get('fit_to_geom')) {
        var bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
        this.map.fitBounds(bounds);
      }
    }

  });
  return AnalysisShapeView;

});
