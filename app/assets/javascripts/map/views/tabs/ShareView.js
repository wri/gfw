/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/tabs/SharePresenter',
  'text!map/templates/tabs/share.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var ShareModel = Backbone.Model.extend({
    defaults: {
      type: null
    }
  });


  var ShareView = Backbone.View.extend({

    el: '#share-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click #share_field' : 'focusInput',
      'click .change-type' : 'changeBtn'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.model = new ShareModel();
      this.render();
      this.setListeners()
    },

    cacheVars: function(){
      this.$changeType = $('.change-type');
      this.$input = $('#share_field');
      this.$twitterLink = this.$el.find('.twitter');
      this.$facebookLink = this.$el.find('.facebook');
      this.$google_plusLink = this.$el.find('.google_plus');
    },

    setListeners: function(){
      this.model.on('change:type', this.setUrls, this);
    },

    render: function(){
      this.$el.html(this.template());
      this.cacheVars();
    },

    // Click button
    changeBtn: function(e){
      var type = $(e.currentTarget).data('type');
      this.$changeType.removeClass('green').addClass('gray');
      $(e.currentTarget).removeClass('gray').addClass('green');
      this.changeType(type);
    },
    // Click input
    focusInput: function(e){
      $(e.currentTarget).select();
    },



    // Set Urls
    changeType: function(type){
      var type = type || this.model.get('type') || 'link';
      this.model.set('type', type);
    },

    setUrls: function(){
      switch(this.model.get('type')){
        case 'link':
          this.setLink();
        break;
        case 'embed':
          this.setEmbed();
        break;
      }
    },

    setLink: function(){
      // Get link short
      this.generateLinkUrl(window.location.href, _.bind(function(url) {
        this.$input.val(url);
        this.$twitterLink.attr('href', 'https://twitter.com/share?url=' + url);
        this.$facebookLink.attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        this.$google_plusLink.attr('href', 'https://plus.google.com/share?url=' + url);
      }, this ));
    },

    setEmbed: function(){
      this.generateEmbedUrl(window.location.href, _.bind(function(url) {
        this.$input.val(url);
      }, this ));
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
      var dim_x = 600, dim_y = 530;
      var url = '<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="'+window.location.origin + '/embed' + window.location.pathname + window.location.search+'"></iframe>';
      callback && callback(url);
    }



  });
  return ShareView;

});
