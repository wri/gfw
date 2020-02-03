/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'text!templates/share.handlebars',
  'views/SharePreviewView'
], function(Backbone, _, Handlebars, mps, tpl, SharePreviewView) {

  'use strict';

  var ShareModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      type: 'link',
      url: window.location.href,
      embedUrl: window.location.href,
      embedHeight: 600,
      embedWidth: 600,
      hideEmbed: false
    },
    setEmbedUrl: function(){
      if($('body').hasClass('is-countries-page')){
        this.embedUrl = window.location.origin + '/embed' + window.location.pathname + window.location.search;
      }else{
        this.embedUrl = window.location.href;
      }
      return this.embedUrl;
    }

  });

  var ShareView = Backbone.View.extend({
    className: 'share-modal mini-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click #share_field' : '_selectTarget',
      'click .change-type' : '_setTypeFromEvent',
      'click #preview' : '_showPreview',
      'click .share-sozial a' : '_shareToSocial',
      'click .overlay' : 'hide',
      'click .close' : 'hide',
      'click .copy_url' : '_copyToClipboard'
    },

    initialize: function(parent) {
      this.model = new ShareModel();
      this._setListeners()
    },

    share: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      this._setUrlsFromEvent(event);
      this.$el.show(0);

      return this;
    },

    hide: function(e) {
      e && e.preventDefault();

      if (this.iframeView !== undefined) {
        this.iframeView.hide();
      }

      this.remove();
    },

    _setListeners: function() {
      this.model.on('change:type', this._toggleTypeButtons, this);
      this.model.on('change:url', this.render, this);

      $(document).on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', true);
        }
      }, this ));
    },

    render: function() {
      this._renderInput();
      this.$el.html(this.template({ hideEmbed: this.model.get('hideEmbed') }));
      this._cacheVars();
    },

    _cacheVars: function() {
      this.$changeType = this.$('.change-type');
      this.$shareinfo = this.$('#share-info p');
      this.$input = this.$('#share_field');
      this.$twitterLink = this.$('.twitter');
      this.$facebookLink = this.$('.facebook');
      this.$google_plusLink = this.$('.google_plus');
      this.$copy = this.$('.copy_url');
    },

    _renderInput: function() {
      switch(this.model.get('type')){
        case 'link':
          setTimeout(_.bind(this._renderLink, this),100);
        break;
        case 'embed':
          setTimeout(_.bind(this._renderEmbed, this),100);
        break;
      }
    },

    _renderLink: function() {
      this._generateLinkUrl(this.model.get('url'), _.bind(function(url) {
        this.model.set('url', url);
        this.$input.val(url);
        this.$shareinfo.html('Click and paste link in email or IM');
        this.$twitterLink.attr('href', 'https://twitter.com/share?url=' + url);
        this.$facebookLink.attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        this.$google_plusLink.attr('href', 'https://plus.google.com/share?url=' + url);
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share link');
    },

    _generateLinkUrl: function(url, callback) {
      $.ajax({
        url: 'https://api-ssl.bitly.com/v3/shorten?longUrl=' + encodeURIComponent(url) + '&login=simbiotica&apiKey=R_33ced8db36b545829eefeb644f4c3d19',
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

    _renderEmbed: function() {
      this.$input.val(this._generateEmbedSrc());

      this.$shareinfo.html('Click and paste HTML to embed in website.');
      // Only show preview on desktop, mobile preview is quite fiddly
      // for the user
      if (!this._isMobile()) {
        this.$shareinfo.append('<button id="preview" class="btn gray little uppercase">Preview</button></p>');
      }

      ga('send', 'event', 'Map', 'Share', 'Share embed');
    },

    _generateEmbedSrc: function() {
      var dim_x = this.model.get('embedWidth') || 600, dim_y = this.model.get('embedHeight') || 600;
      return '<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="' + this.model.get('embedUrl') + '"></iframe>';
    },

    _setUrlsFromEvent: function(event) {
      var hideEmbed = $(event.currentTarget).data('hideembed');
      this.model.set('hideEmbed', !!hideEmbed);
      this.render();

      var url = $(event.currentTarget).data('share-url') || window.location.href;
      this.model.set('url', url);

      var embedUrl = $(event.currentTarget).data('share-embed-url') || window.location.origin + '/embed' + window.location.pathname + window.location.search;
      this.model.set('embedUrl', embedUrl);
      this.model.set('embedWidth', $(event.currentTarget).data('share-embed-width'));
      this.model.set('embedHeight', $(event.currentTarget).data('share-embed-height'));



    },

    _setTypeFromEvent: function(event) {
      this.$copy.html('copy')
      var target_type = $(event.currentTarget).data('type');
      var type = target_type || this.model.get('type') || 'link';
      this.model.set('type', type);
    },

    _toggleTypeButtons: function() {
      this.$changeType.toggleClass('green').toggleClass('gray');
      this._renderInput();
    },

    _selectTarget: function(e) {
      $(e.currentTarget).select();
    },

    _copyToClipboard: function(e) {
      var url = document.querySelector('#share_field');
      url.select();

      try {
        var successful = document.execCommand('copy');
        $(e.currentTarget).html('copied')
      } catch(err) {
        mps.publish('Notification/open', ['notification-clipboard-support']);
      }
    },

    _showPreview: function() {
      this.iframeView = new SharePreviewView({
        src: this.model.get('embedUrl'),
        width: this.model.get('embedWidth'),
        height: this.model.get('embedHeight'),
      });

      $('body').append(this.iframeView.render().$el);
    },

    _shareToSocial: function(e) {
      e && e.preventDefault();

      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = $(e.currentTarget).attr('href'),
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;

      window.open(url, 'Share this map view', opts);
    },

    _isMobile: function() {
      return ($(window).width() > 850) ? false : true;
    }
  });

  return ShareView;

});
