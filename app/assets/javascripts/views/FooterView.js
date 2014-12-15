/**
 * The Footer view.
 */
define([
  'jquery',
  'backbone',
  'slick'
], function($,Backbone,slick) {

  'use strict';

  var FooterView = Backbone.View.extend({

    el: '#footerView',

    initialize: function() {
      // CACHE
      this.$logos = $('#footer-logos');
      this.$footerFixed = $('#footerFixed');
      this.$footerToggle = $('#footerToggle');
      this.$footerClose = $('#footerClose');

      //INIT
      if ($(window).width() >= 850) {
        this.$logos.slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 5,
          speed: 500,
          autoplay: true,
          autoplaySpeed: 3000
        });        
      }

      this.setListeners();
    },

    setListeners: function(){
      if (this.$footerFixed.length) {
        this.$footerToggle.on('click',_.bind(function(e){
          this.$footerFixed.toggleClass('active'); 
          (this.$footerFixed.hasClass('active')) ? this.$footerToggle.text('Hide footer') : this.$footerToggle.text('Show footer');
        }, this ));
        // this.$footerClose.on('click',_.bind(function(e){
        //   this.$footerFixed.removeClass('active');        
        // }, this ));
      }
    }


  });

  return FooterView;

});
