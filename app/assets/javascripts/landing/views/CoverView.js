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
    },

    _setEvents: function () {
      $(window).on('scroll', this._checkAnchorVisibility.bind(this));
      $(window).on('resize', this._rescaleVideoBackground.bind(this));
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
    },

    _onVideoBackgroundReady: function () {
      this.ytVideoBackground.loadVideoById(this.options.videoData);
      this.ytVideoBackground.mute();
    },

    _onVideoBackgroundStateChange: function (e) {
      switch (e.data) {
        case 0:
          this.$videoBackground.removeClass('active');
          break;
        case 1:
          this.$videoBackground.addClass('active');
          break;
        case 2:
          this.$videoBackground.removeClass('active');
          this.ytVideoBackground.seekTo(0);
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

  });
  return CoverView;

});
