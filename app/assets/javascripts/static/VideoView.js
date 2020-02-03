/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'mps'
], function($,Backbone,mps) {

  'use strict';

  var VideoView = Backbone.View.extend({

    el: '#videoView',

    events: {
      'click .btn-video' : 'onChange',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.$player = $('#player');

      // INITS
      this.loadYoutubeAPI();
    },

    loadYoutubeAPI: function(){
      mps.subscribe('YoutubeAPI/ready', _.bind(function(){
        this.loadPlayer(this.$player.data('default'));
      },this));
    },

    loadPlayer: function(id) {
      this.player = new YT.Player('player', {
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

      $(e.currentTarget).addClass('current').siblings().removeClass('current');
      this.player.loadVideoById(id);
    },
  });

  return VideoView;

});
