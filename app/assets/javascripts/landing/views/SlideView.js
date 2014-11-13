/**
 * The Slide view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!landing/templates/paginationSlider.handlebars',
], function($,Backbone, _,mps, Handlebars, tpl) {

  'use strict';

  Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
      accum += block.fn(i);
    return accum;
  });      

  // PAGINATION
  var PaginationView = Backbone.View.extend({
    
    el: '#paginationView',
    
    template: Handlebars.compile(tpl),

    events: {
      'click li' : '_navigateTo'
    },
    
    initialize: function(model){
      this.len = model.len;
      this.render();
      this._setListeners()
    },

    _setListeners: function(){
      mps.subscribe('slider:index', _.bind(function(index){
        this._changeCurrent(index);
      },this));
    },

    render: function(){
      this.$el.html(this.template({len: this.len}));
      this.$pages = this.$el.find('li');
      this._changeCurrent(0);
    },

    _changeCurrent: function(index){
      this.$pages.eq(index).addClass('current').siblings().removeClass('current');
    },

    _navigateTo: function(e){
      var index = $(e.currentTarget).index();
      mps.publish('slider:change',[index]);
    }
  })


  // SLIDER
  var SlideView = Backbone.View.extend({

    el: '#main-slider',

    events: {
      'click #get-started' : 'getStarted',
      'click #go-to-apps' : 'goToApps'
    },

    initialize: function() {
      //Init
      this.$slides = $('.slide');
      this.$getStarted = $('#get-started');
      this.len = this.$slides.length;
      this.position = 0;
      this.interval;
      this.timeTimeout = 1001; // Remember change this value when you change time in landing scss

      //Init Pagination
      this.pagination = new PaginationView({ len: this.len });

      //Inits
      this._setListeners();
      this._autoSlider();      
    },

    _setListeners: function(){
      $('html').on('click',_.bind(this._onHtmlClick,this));
      mps.subscribe('slider:change', _.bind(function(index){
        this.stopAutoSlider();
        this.changePosition(index);
        this.slide();
      },this));
    },

    _autoSlider: function() {
      this.interval = setInterval(_.bind(function(){
        this.changePosition('next');
        this.slide();
      },this),5000)
    },

    stopAutoSlider: function() {
      clearInterval(this.interval);
    },

    changePosition: function(dir) {
      this.positionOld = this.position;
      switch(dir){
        case 'prev':
          (this.position === 0) ? this.position = this.len - 1 : this.position--;
        break;
        case 'next':
          (this.position === this.len - 1) ? this.position = 0 : this.position++;
        break;
        default:
          this.position = dir
        break;
      }
      mps.publish('slider:index',[this.position]);
    },

    slide: function() {
      this.$slides.eq(this.position).addClass('current');
      this.$slides.eq(this.positionOld).addClass('leave').removeClass('current')
      setTimeout(_.bind(function(){
        this.$slides.eq(this.position).siblings().removeClass('leave');
      },this),this.timeTimeout)
    },


    getStarted: function(e){
      e.preventDefault();
      e.stopPropagation();
      $(e.currentTarget).toggleClass('active');
    },

    /**
     * Closes submenu tooltip
     * Check the click target is not the dialog itself.
     *
     * @param  {Object} e Event
     */
    _onHtmlClick: function(e) {
      if (!$(e.target).hasClass('submenu-tooltip') && this.$getStarted.hasClass('active')) {
        this.$getStarted.removeClass('active');
      }
    },


    goToApps: function(e){
      e.preventDefault();
      var posY = $($(e.currentTarget).attr('href')).offset().top;
      $('html,body').animate({scrollTop: posY},500);
    }

  });

  return SlideView;

});
