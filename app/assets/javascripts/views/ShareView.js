/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'text!templates/share.handlebars'
], function(_, Handlebars, tpl) {

  'use strict';

  var ShareModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      type: 'link',
      iframe: null,
      url: window.location.href
    }
  });

  var ShareView = Backbone.View.extend({
    el: '.share-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click #share_field' : '_selectTarget',
      'click .change-type' : '_setTypeFromEvent',
      'click #preview' : '_showPreview',
      'click .share-sozial a' : '_shareToSocial',
      'click .overlay' : 'hide',
      'click .close' : 'hide'
    },

    initialize: function(parent) {
      this.model = new ShareModel();
      this.render();
      this._setListeners()
    },

    share: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      this._setUrlFromEvent(event);
      this.$el.show(0);
    },

    hide: function(e){
      e && e.preventDefault();
      this.$el.hide();
    },

    _setListeners: function(){
      this.model.on('change:type', this._toggleTypeButtons, this);
      this.model.on('change:url', this.render, this);

      $(document).on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', true);
        }
      }, this ));
    },

    render: function(){
      this._renderInput();
      this.$el.html(this.template());
      this._cacheVars();
    },

    _cacheVars: function(){
      this.$changeType = $('.change-type');
      this.$shareinfo = $('#share-info');
      this.$input = $('#share_field');
      this.$iframe = $('#preview-iframe');
      this.$twitterLink = this.$el.find('.twitter');
      this.$facebookLink = this.$el.find('.facebook');
      this.$google_plusLink = this.$el.find('.google_plus');
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

    _renderLink: function(){
      this._generateLinkUrl(this.model.get('url'), _.bind(function(url) {
        this.model.set('url', url);
        this.$input.val(url);
        this.$shareinfo.html('<p>Click and paste link in email or IM</p>');
        this.$twitterLink.attr('href', 'https://twitter.com/share?url=' + url);
        this.$facebookLink.attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        this.$google_plusLink.attr('href', 'https://plus.google.com/share?url=' + url);
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share Link clicked');
    },

    _generateLinkUrl: function(url, callback) {
      $.ajax({
        url: 'https://api-ssl.bitly.com/v3/shorten?longUrl=' + encodeURIComponent(url) + '&login=vizzuality&apiKey=R_de188fd61320cb55d359b2fecd3dad4b',
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

    _renderEmbed: function(){
      this._generateEmbedUrl(window.location.href, _.bind(function(url,src) {
        this.model.set('iframe', src);
        this.$input.val(url);
        this.$shareinfo.html('<p>Click and paste HTML to embed in website.<button id="preview" class="btn gray little uppercase source" data-iframe="true" data-source="preview-iframe-container">Preview</button></p>');
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share Embed clicked');
    },

    _generateEmbedUrl: function(url, callback){
      var dim_x = 800, dim_y = 600;
      var src = window.location.origin + '/embed' + window.location.pathname + window.location.search;
      var url = '<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + window.location.pathname + window.location.search+'"></iframe>';
      callback && callback(url,src);
    },

    _setUrlFromEvent: function(event) {
      var url = $(event.currentTarget).data('share');
      if (url !== undefined) {
        this.model.set('url', url)
      }
    },

    _setTypeFromEvent: function(event) {
      var target_type = $(event.currentTarget).data('type');
      var type = target_type || this.model.get('type') || 'link';
      this.model.set('type', type);
    },

    _toggleTypeButtons: function() {
      this.$changeType.toggleClass('green').toggleClass('gray');
      this._renderInput();
    },

    _selectTarget: function(e){
      $(e.currentTarget).select();
    },

    _showPreview: function(){
      this.$iframe.attr('src', this.model.get('iframe'));
    },

    _shareToSocial: function(e){
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
    }
  });

  return ShareView;

});
