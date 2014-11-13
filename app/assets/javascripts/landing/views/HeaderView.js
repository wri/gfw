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
      this.$navMobile = $('#nav-mobile');
    },

    toggleMenu: function(e){

      $(e.currentTarget).toggleClass('active');
      this.$htmlbody.toggleClass('active');
      this.$el.toggleClass('active');
      this.$navMobile.toggleClass('active');
    }


  });

  return HeaderView;

});
