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

    initialize: function() {
      //Init
      this.$slides = $('.slide');
      this.len = this.$slides.length;
      this.position = 0;
      this.interval;
      this.timeTimeout = 1001; // Remember change this value when you change time in landing scss

      //Init Pagination
      this.pagination = new PaginationView({ len: this.len });

      //Inits
      this._setListeners()
      this._autoSlider();
    },

    _setListeners: function(){
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
    }

  });

  return SlideView;

});
