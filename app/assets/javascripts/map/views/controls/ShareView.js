/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/controls/SharePresenter',
  'text!map/templates/controls/share.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var ShareModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      type: null,
      link: null,
      iframe: null
    }
  });

  var ShareView = Backbone.View.extend({

    el: '#control-share',

    template: Handlebars.compile(tpl),

    events: {
      'click #share_field' : 'focusInput',
      'click .change-type' : 'changeBtn',
      'click #preview' : 'showPreview',
      'click .popup' : 'openPopUp',
      'click .overlay' : 'hide',
      'click .close' : 'hide'
    },

    initialize: function(parent) {
      this.parent = parent;
      this.presenter = new Presenter(this);
      this.model = new ShareModel();
      this.render();
      this.setListeners()
    },

    cacheVars: function(){
      this.$changeType = $('.change-type');
      this.$shareinfo = $('#share-info');
      this.$input = $('#share_field');
      this.$iframe = $('#preview-iframe');
      this.$twitterLink = this.$el.find('.twitter');
      this.$facebookLink = this.$el.find('.facebook');
      this.$google_plusLink = this.$el.find('.google_plus');
    },

    setListeners: function(){
      this.model.on('change:hidden', this.toggle, this);
      this.model.on('change:type', this.setUrls, this);
      $(document).on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', true);
        }
      }, this ));
    },

    render: function(){
      this.$el.html(this.template());
      this.cacheVars();
    },

    toggle: function(){
      if (this.model.get('hidden')) {
        this.$el.hide(0);
      }else{
        this.$el.show(0);
        this.setUrls();
        this.changeType();
      }
    },

    // Click button
    changeBtn: function(e){
      e && e.preventDefault();

      // change classes of buttons
      var type = $(e.currentTarget).data('type');
      this.$changeType.removeClass('green').addClass('gray');
      $(e.currentTarget).removeClass('gray').addClass('green');

      // Trigger model's type change
      this.changeType(type);
    },
    // Select all text of input
    focusInput: function(e){
      $(e.currentTarget).select();
    },
    // click preview
    showPreview: function(){
      this.$iframe.attr('src' , this.model.get('iframe'));
    },
    // Open popup social share
    openPopUp: function(e){
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
    hide: function(e){
      e && e.preventDefault();
      this.model.set('hidden', true);
    },









    // Set Urls
    changeType: function(type){
      // This will trigger model's type change (setUrls())
      var type = type || this.model.get('type') || 'link';
      this.model.set('type', type);
    },

    setUrls: function(){
      switch(this.model.get('type')){
        case 'link':
          setTimeout(_.bind(this.setLink, this),100);
        break;
        case 'embed':
          setTimeout(_.bind(this.setEmbed, this),100);
        break;
      }
    },

    setLink: function(){
      // Get link short
      this.generateLinkUrl(window.location.href, _.bind(function(url) {
        this.model.set('url', url);
        this.$input.val(url);
        this.$shareinfo.html('<p>Click and paste link in email or IM</p>');
        this.$twitterLink.attr('href', 'https://twitter.com/share?url=' + url);
        this.$facebookLink.attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        this.$google_plusLink.attr('href', 'https://plus.google.com/share?url=' + url);
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share Link clicked');
    },

    setEmbed: function(){
      this.generateEmbedUrl(window.location.href, _.bind(function(url,src) {
        this.model.set('iframe', src);
        this.$input.val(url);
        this.$shareinfo.html('<p>Click and paste HTML to embed in website.<button id="preview" class="btn gray little uppercase source" data-iframe="true" data-source="preview-iframe-container">Preview</button></p>');
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share Embed clicked');
    },

    generateLinkUrl: function(url, callback) {
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

    generateEmbedUrl: function(url, callback){
      var dim_x = 800, dim_y = 600;
      var src = window.location.origin + '/embed' + window.location.pathname + window.location.search;
      var url = '<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + window.location.pathname + window.location.search+'"></iframe>';
      callback && callback(url,src);
    }



  });
  return ShareView;

});
