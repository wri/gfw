/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps'
], function($,Backbone, _,mps) {

  'use strict'; 

  var HeaderView = Backbone.View.extend({

    el: '#headerView',

    events: {
      'click #btn-menu' : 'toggleMenu'
    },

    initialize: function() {
      //CACHE
      this.$htmlbody = $('html,body');
      this.$window = $(window);
      this.$navMobile = $('#nav-mobile');
      this.$translate = $('#google_translate_element');

      this.positionTranslate();
      this.$window.on('resize',_.bind(this.positionTranslate,this))
    },

    toggleMenu: function(e){
      $(e.currentTarget).toggleClass('active');
      if ($(e.currentTarget).hasClass('active')) {
        this.$htmlbody.addClass('active');
        this.$el.addClass('active');
        this.$navMobile.addClass('active');        
      }else{
        this.$htmlbody.removeClass('active');
        this.$el.removeClass('active');
        this.$navMobile.removeClass('active');                
      }
    },

    positionTranslate: function(){
      if (this.$window.width() > 700) {
        this.$translate.appendTo($('#google_translate_element_box1'));
      }else{
        this.$translate.appendTo($('#google_translate_element_box2'));
      }
    }
  });

  return HeaderView;

});
