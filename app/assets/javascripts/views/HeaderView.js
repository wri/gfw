/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps'
], function($,Backbone, _,mps, slick) {

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
      this.$htmlbody.toggleClass('active');
      this.$el.toggleClass('active');
      this.$navMobile.toggleClass('active');
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
