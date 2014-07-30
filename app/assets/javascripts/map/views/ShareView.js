/**
 * The ShareView view.
 *
 * @return ShareView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/SharePresenter',
  'text!templates/share.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var ShareView = Widget.extend({

    className: 'widget widget-share',

    template: Handlebars.compile(tpl),

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false,
      boxDraggable: false
    },

    events: function(){
      return _.extend({}, ShareView.__super__.events, {
        'click .widget-btn': '_show',
        'click .mode_menu a': '_onClickMode',
        'click .close' : '_hide'
      });
    },

    initialize: function() {
      ShareView.__super__.initialize.apply(this);
      this.presenter = new Presenter(this);
    },

    _onClickMode: function(e) {
       e && e.preventDefault();
      var mode = $(e.currentTarget).data('embed'),
          text = 'Click and paste link in email or IM';

      if (mode === 'url') {
        this._setLink();
      } else if (mode === 'embed') {
          text = 'Click and paste HTML to embed in website';
        this._setEmbed();
      }

      $('.share_dialog').find('.help span').empty().append(text);
    },

    _show: function(e) {
      e && e.preventDefault();
      $('.backdrop').fadeIn(function(){
        $('.share_dialog').parent().fadeIn();
      });
      this._initBindings();
      this._setLink();
    },

    _initBindings: function() {
      var that = this;
      $('.backdrop').on('click', function() {
        that._hide();
      });

      $('.field').on('click',function(){
        this.select();
      });
    },

    _hide: function(e) {
      e && e.preventDefault();
      this.$el.find('.share_dialog').parent().fadeOut(function(){
        $('.backdrop').fadeOut();
      });
    },

    _setLink: function() {
      var that = this,
          $dialog = $('.share_dialog');
      this.$input = $dialog.find('.field');
      this.$loading = $dialog.find('.share_loading');
      this.$share = $dialog.find('.share_buttons');

      // Disable textarea
      this.$input.val('');
      this.$loading.show();

      // Get link short
      this._generateShortUrl(window.location.href, function(url) {
        that.$input.val(url);

        that.$share.find('.twitter').attr('href', 'https://twitter.com/share?url=' + url);
        that.$share.find('.facebook').attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        that.$share.find('.google_plus').attr('href', 'https://plus.google.com/share?url=' + url);

        that.$loading.hide();
      });
    },

    _setEmbed: function() {
      this.$input = $('.share_dialog').find('.field');
      var dim_x = 640,
          dim_y = 530;

      if ($('section').hasClass('current_share')) {
        var $targ    = $('section.current_share'),
            targ_val = '/alerts', //default value
            path     = window.location.pathname;

        dim_y = 360;
        path = path.replace('country','country_info');
        if (path.slice(-1) === '/') {
          path = path.slice(0, -1);
        }

        if ($targ.hasClass('country-forests-type')) {
          targ_val = '/forests-type';
        } else if ($targ.hasClass('country-production')) {
          targ_val = '/production';
        } else if ($targ.hasClass('country-employment')) {
          targ_val = '/employment';
        } else if ($targ.hasClass('country-tenure')) {
          targ_val = '/tenure';
        }
        $targ.removeClass('current_share');
        this.$input.val('<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + path + targ_val + '"></iframe>');
      } else {
        this.$input.val('<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + window.location.pathname + window.location.search+'"></iframe>');
      }
    },

    _generateShortUrl: function(url, callback) {
      $.ajax({
        url: 'https://api-ssl.bitly.com/v3/shorten?longUrl=' + encodeURIComponent(url) + '&loginvizzuality&apiKey=',
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        success: function(r) {
          if (!r.data.url) {
            callback && callback(url);

            throw new Error('BITLY doesn\'t allow localhost alone as domain, use localhost.lan for example');
          } else {
            callback && callback(r.data.url);
          }
        },
        error: function() {
          callback && callback(url);
        }
      });
    },
  });

  return ShareView;

});
