/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'enquire',
], function($, Backbone, _, enquire) {

  'use strict';

  var CoverView = Backbone.View.extend({

    el: '.c-home-cover',

    events: {
      'click .js_summary_anchor' : '_onClickSummaryAnchor',
      'click .js-yt-home-cover-video-button' : '_onClickVideoButton',
    },

    options: {
      videoData: {
        videoId: '0XsJNU75Si0',
        suggestedQuality: 'hd720',
        startSeconds: 0,
        endSeconds: 40
      },
      videoDefaults: {
        autoplay: 0,
        autohide: 1,
        loop : 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 0,
        iv_load_policy: 3
      }
    },

    initialize: function () {
      this._cache();
      this._setEvents();

      enquire.register("screen and (min-width: 415px)", {
        match: function() {
          this._loadVideoBackground();
        }.bind(this)
      });
    },

    _cache: function () {
      this.$summaryAnchor = this.$el.find('.js_summary_anchor');
      this.$videoBackground = this.$el.find('.js-home-cover-video');
      this.$videoButton = this.$el.find('.js-yt-home-cover-video-button');
      this.startedLoading = null;
      this.timerVideo = null;
    },

    _setEvents: function () {
      $(window).on('scroll', this._checkAnchorVisibility.bind(this));

      if (this._isVideoActive()) {
        $(window).on('resize', this._rescaleVideoBackground.bind(this));
      }
    },

    _onClickSummaryAnchor: function () {
      $('html, body').animate({
        scrollTop: $('.c-home-summary').offset().top
      }, 500);
    },

    _checkAnchorVisibility: function () {
      var heightLimit = $(window).height() / 4;
      if ($(window).scrollTop() >= heightLimit) {
        this.$summaryAnchor.fadeOut();
        $(window).off('scroll', this._checkAnchorVisibility.bind(this));
      }
    },

    _loadVideoBackground: function () {
      if (this._isVideoActive()) {
        $.getScript("https://www.youtube.com/player_api", function() {
          window.onYouTubePlayerAPIReady = function() {
            this.ytVideoBackground = new YT.Player('yt-home-cover-video', {
              events: {
                'onReady': this._onVideoBackgroundReady.bind(this),
                'onStateChange': this._onVideoBackgroundStateChange.bind(this)
              },
              playerVars: this.options.videoDefaults
            });
            this._rescaleVideoBackground();
          }.bind(this)
        }.bind(this));
      }
    },

    _onVideoBackgroundReady: function () {
      this.startedLoading = new Date();

      this._clearVideoTimer();
      this.timerVideo = setInterval(function() {
        this._checkVideoPlayback();
      }.bind(this), 5000);

      this.ytVideoBackground.loadVideoById(this.options.videoData);
      this.ytVideoBackground.mute();
    },

    _onVideoBackgroundStateChange: function (e) {
      switch (e.data) {
        case YT.PlayerState.ENDED:
          this.$videoBackground.removeClass('active');
          this.$videoButton.removeClass('-visible');
          break;
        case YT.PlayerState.PLAYING:
          this.$videoBackground.addClass('active');
          this.$videoButton.addClass('-visible');
        break;
        case YT.PlayerState.PAUSED:
          this.$videoBackground.removeClass('active');
          this.$videoButton.removeClass('-visible');
          // this.ytVideoBackground.seekTo(0);
          break;
      }
    },

    _rescaleVideoBackground: function () {
      var w = this.$videoBackground.width(),
        h = this.$videoBackground.height();

      if (w/h > 16/9){
        this.ytVideoBackground.setSize(w, w/16*9);
        $('#yt-home-cover-video').css({'left': '0px'});
      } else {
        this.ytVideoBackground.setSize(h/9*16, h);
        $('#yt-home-cover-video').css({'left': -(this.$videoBackground.outerWidth()-w)/2});
      }
    },

    _checkVideoPlayback: function() {
      var currentDate = new Date();
      var datesDiff = (currentDate.getTime() - this.startedLoading.getTime()) / 1000;
      var currentState = this.ytVideoBackground.getPlayerState();

      // Higher than 35secs loading and 3 (video buffering)
      if (datesDiff > 35 && currentState === 3) {
        this._clearVideoTimer();
        this.ytVideoBackground.stopVideo();
      }
    },

    _clearVideoTimer: function() {
      if (this.timerVideo) {
        clearInterval(this.timerVideo);
      }
    },

    _onClickVideoButton: function() {
      localStorage.setItem('gfw-disable-home-video', 'true');

      // Stop video
      this.ytVideoBackground.stopVideo();
      this._clearVideoTimer();

      this.$videoBackground.removeClass('active');
      this.$videoButton.removeClass('-visible');
    },

    _isVideoActive: function() {
      return !localStorage.getItem('gfw-disable-home-video');
    }

  });
  return CoverView;

});
