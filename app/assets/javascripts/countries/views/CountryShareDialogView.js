/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'mps',
  'countries/helpers/CountryHelper',
  'text!countries/templates/shareCountriesDialog.handlebars',


], function($, Backbone, _, Handlebars, d3, mps, CountryHelper, shareDialogTPL) {

  'use strict';

  var ShareDialogModel = Backbone.Model.extend({
    defaults: {
      title: $('body').hasClass('home') ? "Share this map view" : "Share this graphic",
      help: "Click and paste link in email or IM",
      button_title: "Copy URL",
      hidden: false,
      mode: "link"
    }

  });

  var ShareDialogView = Backbone.View.extend({
    className: 'share_dialog',

    events: {
      'click .close': 'hide',
      'click .mode_menu a': '_onClickMode'
    },

    template: Handlebars.compile(shareDialogTPL),

    initialize: function(options) {
      _.bindAll( this, '_toggleMode', '_onKeyDown' );

      this.options = _.extend(options, this.options, this.defaults);

      this.model = new ShareDialogModel();

      this.model.on('change:hidden', this.toggle);
      this.model.on('change:mode', this._toggleMode);

      this.$backdrop = $('.backdrop');

    },

    show: function() {
      this._setLink();

      this.$modeMenu = $('.mode_menu');
      this.$modeMenu.find('.first')
        .addClass('selected')
        .siblings()
        .removeClass('selected')

      this.$el.fadeIn(250);
      this.$backdrop.show();

      this._initBindings();
    },

    hide: function(e) {
      e && e.preventDefault();

      var that = this;

      this.$el.fadeOut(250, function() {
        that._setMode('link');
      });

      this.$backdrop.fadeOut(250);

      this._disableBindings();
    },

    _initBindings: function() {
      var that = this;

      $(document).on('keydown', this._onKeyDown);

      this.$backdrop.on('click', function() {
        that.hide();
      });

      this.$input.on('click',function(){
        this.select()
      });
    },

    _disableBindings: function() {
      $(document).off('keydown');

      this.$backdrop.off('click');
    },

    _setLink: function() {
      var that = this;

      // Disable textarea
      this.$input.val('');
      this.$loading.show();

      // Get link short
      this._generateShortUrl(window.location.href, function(url) {
        that.$input.val(url);

        that.$share.find('.twitter').attr('href', "https://twitter.com/share?url=" + url);
        that.$share.find('.facebook').attr('href', "https://www.facebook.com/sharer.php?u=" + url);
        that.$share.find('.google_plus').attr('href', "https://plus.google.com/share?url=" + url);

        that.$loading.hide();
      });
    },

    _setEmbed: function() {
      var $body  = $('body'),
          dim_x = 640,
          dim_y = 530;

      if (!$body.hasClass('home')) {
        dim_x = 1000;
        dim_y = ($body.hasClass('show')) ? 480 : 600;
        dim_y = ($body.hasClass('is-overview-action')) ? 700 : dim_y;
      }

      if ($('section').hasClass('current_share')) {
        var $targ    = $('section.current_share'),
            targ_val = '/alerts', //default value
            path     = window.location.pathname;

        dim_y = 360;
        path = path.replace('country','country_info');
        if (path.slice(-1) === "/") path = path.slice(0, -1);

        if ($targ.hasClass('country-forests-type')) {
          targ_val = '/forests-type';
        } else if ($targ.hasClass('country-production')) {
          targ_val = '/production';
        } else if ($targ.hasClass('country-employment')) {
          targ_val = '/employment';
        } else if ($targ.hasClass('country-tenure')) {
          targ_val = '/tenure';
        } else if ($targ.hasClass('country-carbon_stocks')) {
          targ_val = '/carbon_stocks';
        } else if ($targ.hasClass('emissions-text')) {
          targ_val = '/emissions';
        }
        $targ.removeClass('current_share');
        this.$input.val('<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + path + targ_val + '"></iframe>');
      } else {
        this.$input.val('<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + window.location.pathname + window.location.search+'"></iframe>');
      }
    },

    _generateShortUrl: function(url, callback) {
      $.ajax({
        url:"https://api-ssl.bitly.com/v3/shorten?longUrl=" + encodeURIComponent(url) + "&login=" + this.options.bitly.login + "&apiKey=" + this.options.bitly.key,
        type:"GET",
        async: false,
        dataType: 'jsonp',
        success: function(r) {
          if (!r.data.url) {
            callback && callback(url);

            throw new Error('BITLY doesn\'t allow localhost alone as domain, use localhost.lan for example');
          } else {
            callback && callback(r.data.url)
          }
        },
        error: function(e) { callback && callback(url) }
      });
    },

    _onKeyDown: function(e) {
      if (e.which == 27) this._onEscKey(e);
    },

    _onEscKey: function(e) {
      e && e.preventDefault();

      this.hide();
    },

    _onClickMode: function(e) {
      e && e.preventDefault();

      var $target = $(e.target),
          mode = $target.attr('data-embed');

      if (mode != this.model.get('mode')) {
        this.$modeMenu = $('.mode_menu');

        this.$modeMenu.find('li').removeClass('selected');
        $(e.currentTarget).parent().addClass('selected');

        this._setMode(mode);
      }
    },

    _setMode: function(mode) {
      this.model.set({ mode: mode });
    },

    _toggleMode: function() {
      var mode = this.model.get('mode');

      if (mode === 'url') {
        this.model.set({
          help: this.model.defaults.help,
          button_title: this.model.defaults.button_title
        });
        ga('send', 'event', 'Country show', 'Share', 'Show dialog URL');
        this._setLink();
      } else if (mode === 'embed') {
        ga('send', 'event', 'Country show', 'Share', 'Show dialog EMBED');
        this.model.set({
          help: 'Click and paste HTML to embed in website',
          button_title: 'Copy code'
        });

        this._setEmbed();
      }

      this.$help.html(this.model.get('help'));
      this.$button.html(this.model.get('button_title'));
    },

    render: function() {
      var that = this;

      this.$el.append(this.template( this.model.toJSON() ));

      this.$help = this.$el.find('.help span');
      this.$input = this.$el.find('.field');
      this.$button = this.$el.find('.copy');
      this.$loading = this.$el.find('.share_loading');
      this.$share = this.$el.find('.share_buttons');

      return this.$el;
    }
  });

  return ShareDialogView;

});
