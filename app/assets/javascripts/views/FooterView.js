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
      this.$logos.slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slide: 'li'
      });

      this.setListeners();
    },

    setListeners: function(){
      if (this.$footerFixed.length) {
        this.$footerToggle.on('click',_.bind(function(e){
          ga('send', 'event', 'Map', 'Toggle', 'Footer');
          this.$footerFixed.toggleClass('active');
          this.$footerToggle.parents('#map-footer').toggleClass('active');
          (this.$footerFixed.hasClass('active')) ? this.$footerToggle.text('Hide footer') : this.$footerToggle.text('Show footer');
        }, this ));
      }
    }


  });

  return FooterView;

});
