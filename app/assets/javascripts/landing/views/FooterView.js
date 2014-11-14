/**
 * The Footer view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'slick'
], function($,Backbone, _,mps, slick) {

  'use strict';

  var FooterView = Backbone.View.extend({

    el: '#footerView',

    initialize: function() {
      // CACHE
      this.$logos = $('#footer-logos');

      // this.$logos.slick({
      //   infinite: true,
      //   slidesToShow: 5,
      //   slidesToScroll: 5,
      //   speed: 500,
      //   autoplay: true,
      //   autoplaySpeed: 3000
      // });
    },


  });

  return FooterView;

});
