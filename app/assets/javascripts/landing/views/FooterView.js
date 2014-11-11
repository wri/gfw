/**
 * The Slide view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'slick'
], function($,Backbone, _,mps, slick) {

  'use strict'; 

  // SLIDER
  var FooterView = Backbone.View.extend({

    el: '#footerView',

    initialize: function() {
      console.log('init');
    },

  });

  return FooterView;

});
