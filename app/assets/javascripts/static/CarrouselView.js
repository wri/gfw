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
      this.current = 0;
      this.tab = null;
      this.$btnTab = this.$el.find('.btn-tab'); 
      this.$slide = this.$el.find('.slide');
    },

    onTab: function(e) {
      e && e.preventDefault();
      // Pause video before changing slides
      this.pauseVideo();
      
      // Vars
      this.tab = $(e.currentTarget).data('tab');
      this.current = $(e.currentTarget).parent().index();

      //Toogle
      this.$btnTab.removeClass('visible');
      $(e.currentTarget).addClass('visible');

      $(this.tab).addClass('visible').siblings().removeClass('visible');
    },

    pauseVideo: function(){
      var $video = this.$slide.eq(this.current).find('iframe').attr('id');
      document.getElementById($video).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');      
    }

  });

  return CarrouselView;

});

