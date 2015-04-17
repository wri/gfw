/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'views/ShareView'
], function($,Backbone, _,mps, ShareView) {

  'use strict';

  var HeaderView = Backbone.View.extend({

    el: '#headerView',

    events: {
      'click #btn-menu' : 'toggleMenu',
      'click .share-link' : 'shareOpen'
    },

    initialize: function() {
      //CACHE
      this.$htmlbody = $('html,body');
      this.$window = $(window);
      this.$document = $(document);
      this.$navMobile = $('#nav-mobile');
      this.$footer = $('#footerMenu');
      this.$siteMap = $('#siteMap');
      this.$mobileMenu = $('#mobileMenu');
      this.$translate = $('#google_translate_element');

      this.createMenu();
      this.$window.on('resize',_.bind(this.createMenu,this))
    },

    toggleMenu: function(e){
      $(e.currentTarget).toggleClass('active');
      if ($(e.currentTarget).hasClass('active')) {
        this.scrollTop = this.$document.scrollTop();
        this.$htmlbody.addClass('active');
        this.$el.addClass('active');
        this.$navMobile.addClass('active');
      }else{
        this.$htmlbody.removeClass('active').animate({ scrollTop: this.scrollTop }, 0);
        this.$el.removeClass('active');
        this.$navMobile.removeClass('active');
      }
    },

    createMenu: function(){
      if (this.$window.width() > 850) {
        this.$footer.appendTo(this.$siteMap);
        this.$translate.appendTo($('#google_translate_element_box1'));
      }else{
        this.$footer.appendTo(this.$mobileMenu);
        this.$translate.appendTo($('#google_translate_element_box2'));
      }
    },

    shareOpen: function(event){
      var shareView = new ShareView().share(event);
      this.$el.append(shareView.el);
    }


  });

  return HeaderView;

});
