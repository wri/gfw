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
], function(_, Handlebars, Presenter, tpl) {

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
      this.$el.html(this.template());

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
    }



  });
  return AnalysisShapeView;

});
