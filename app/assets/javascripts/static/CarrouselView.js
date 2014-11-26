/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'slick'
], function($,Backbone,slick) {

  'use strict';

  var CarrouselView = Backbone.View.extend({

    el: '#carrouselView',

    events: {
      'click .btn-tab' : 'onTab',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
    },

    onTab: function(e) {
      e && e.preventDefault();
      var tab = $(e.currentTarget).data('tab');
      $(tab).addClass('visible').siblings().removeClass('visible');
    },

  });

  return CarrouselView;

});

