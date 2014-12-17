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

    // <script>
    //                 // 2. This code loads the IFrame Player API code asynchronously.
    //                 var tag = document.createElement('script');

    //                 tag.src = "https://www.youtube.com/iframe_api";
    //                 var firstScriptTag = document.getElementsByTagName('script')[0];
    //                 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //                 // 3. This function creates an <iframe> (and YouTube player)
    //                 //    after the API code downloads.
    //                 var player;
    //                 function onYouTubeIframeAPIReady() {
    //                   player = new YT.Player('player', {
    //                     height: '390',
    //                     width: '640',
    //                     videoId: 'M7lc1UVf-VE',
    //                     events: {
    //                       'onReady': onPlayerReady,
    //                       'onStateChange': onPlayerStateChange
    //                     }
    //                   });
    //                 }

    //                 // 4. The API will call this function when the video player is ready.
    //                 function onPlayerReady(event) {
    //                   event.target.playVideo();
    //                 }

    //                 // 5. The API calls this function when the player's state changes.
    //                 //    The function indicates that when playing a video (state=1),
    //                 //    the player should play for six seconds and then stop.
    //                 var done = false;
    //                 function onPlayerStateChange(event) {
    //                   if (event.data == YT.PlayerState.PLAYING && !done) {
    //                     setTimeout(stopVideo, 6000);
    //                     done = true;
    //                   }
    //                 }
    //                 function stopVideo() {
    //                   player.stopVideo();
    //                 }
    //               </script> 