/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'mps',
  'enquire',
], function($,Backbone,mps,enquire) {

  'use strict';

  var CarrouselView = Backbone.View.extend({

    el: '#carrouselView',

    events: {
      'click .btn-video' : 'onChange',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.$btnVideo = $('.btn-video');
      this.$player = $('#playerCarrousel');

      // INITS
      this.loadYoutubeAPI();
    },

    loadYoutubeAPI: function(){
      mps.subscribe('YoutubeAPI/ready', _.bind(function(){
        enquire.register("screen and (min-width:850px)", {
          match: _.bind(function(){
            this.loadPlayer(this.$player.data('default'));
          },this)
        });


      },this));
    },

    loadPlayer: function(id) {
      this.player = new YT.Player('playerCarrousel', {
        videoId: id,
        width: 356,
        height: 200,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showInfo: 0
        }
      });
    },

    onChange: function(e) {
      e && e.preventDefault();
      var id = $(e.currentTarget).data('video');

      this.$btnVideo.removeClass('visible');
      $(e.currentTarget).addClass('visible');

      this.player.loadVideoById(id);
    },

  });

  return CarrouselView;

});

