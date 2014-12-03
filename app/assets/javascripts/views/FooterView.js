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

      //INIT
      this.$logos.slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000
      });

      this.setListeners();
    },

    setListeners: function(){
      if (this.$footerFixed.length) {
        this.$footerToggle.on('click',_.bind(function(e){
          $(e.currentTarget).toggleClass('active');
          this.$footerFixed.toggleClass('active');

          ($(e.currentTarget).hasClass('active')) ? $(e.currentTarget).text('Hide footer') : $(e.currentTarget).text('Show footer');
          
        }, this ));
      }
    }


  });

  return FooterView;

});
