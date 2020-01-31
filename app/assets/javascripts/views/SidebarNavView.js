/**
 * The SidebarNavView view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps'
], function($,Backbone, _,mps) {

  'use strict';

  var SidebarNavModel = Backbone.Model.extend({
    defaults: {
      section: null,
      t: null,
      interesting: null
    }
  });


  var SidebarNavView = Backbone.View.extend({

    el: '#sidebarNavView',

    events: {
      'click .nav-item' : 'changeSourceNav',
      'click .nav-title' : 'scrollTo',
      'click .source_header' : 'toggleSources',
      'click .source_dropdown_header' : 'toggleDropdown',
      'click .source_dropdown_menu a' : 'showSubContent',
      'click #back-btn' : 'returnBack'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      this.model = new SidebarNavModel();

      //CACHE
      this.$window = $(window);
      this.$document = $(document);
      this.$htmlbody = $('html,body');
      this.$headerH1 = $('#headerView').find('h1');
      this.$backBtn = $('#back-btn');
      this.$navItem = this.$el.find('.nav-item');
      this.$sideBarAside = $('#sidebarAside');
      this.$sideBarBox = $('#sources-box');
      this.$sourceArticle = $('.source-article');
      this.$sourceHeader = $('.source_header');
      this.$sourceBody = $('.source_body');
      this.$cut = $('#cut');
      this.$sourceSpinner = $('#sources-spinner');
      this.$loaderMobile = $('#loader-mobile');

      //VARS
      this.padding = 40;
      this.first = true;
      this.mobile = (this.$window.width() > 850) ? false : true;


      //INIT
      this.setListeners();
    },

    setListeners: function(){

      this.calculateOffsets();
      this.scrollDocument();
      this.$document.on('scroll',_.bind(this.scrollDocument,this));
      this.$window.on('resize',_.bind(this.calculateOffsets,this));

      mps.subscribe('SourceStatic/change',_.bind(this.changeSource,this));
      mps.subscribe('SubItem/change',_.bind(this.calculateOffsets,this));

      _.delay(_.bind(function(){
        this.$loaderMobile.removeClass('-start');
      }, this ), 250)

    },



    calculateOffsets: function(){
      this.mobile = (this.$window.width() > 850) ? false : true;
      this.offset = this.$el.offset().top + parseInt(this.$el.css('paddingTop'), 10);
      this.offsetBottom = this.$cut.offset().top - this.$sideBarAside.height() - this.padding;
      if (!this.mobile) {
        this.$sideBarBox.css({'min-height': this.$sideBarAside.height() });
        this.$htmlbody.removeClass('active');
      }
    },

    scrollDocument: function(e){
      var scrollTop = this.$document.scrollTop();
      if (scrollTop > this.offset) {
        this.$sideBarBox.addClass('fixed');
        this.firstFixed = false;
        if(scrollTop < this.offsetBottom) {
          this.$sideBarAside.removeClass('bottom').addClass('fixed');
        }else{
          this.$sideBarAside.removeClass('fixed').addClass('bottom');
        }
      }else{
        this.$sideBarAside.removeClass('fixed bottom');
        this.$sideBarBox.removeClass('fixed');
        this.firstFixed = true;
      }
    },

    changeSourceNav: function(e){
      e && e.preventDefault();
      this.model.set('section',$(e.currentTarget).data('slug'));
      this.model.set('interesting', $(e.currentTarget).data('interesting'));
      this.model.set('t',null);
      this.updateSource();
    },
    toggleSources: function(e){
      ($(e.currentTarget).hasClass('active')) ? this.model.set('t', null) : this.model.set('t', $(e.currentTarget).parent().attr('id'));
      this.$sourceHeader.removeClass('active');
      this.$sourceBody.hide(0);
      this.updateSource();
    },

    toggleDropdown: function(e){
      e && e.preventDefault();
      $(e.currentTarget).parents('.source_dropdown').find('.source_dropdown_menu').toggle(0);
    },

    updateSource: function(){
      var params = {
        section: this.model.get('section'),
        interesting: this.model.get('interesting'),
        t: this.model.get('t')
      }
      mps.publish('SourceStatic/update',[params]);
    },

    changeSource: function(params){
      //spinner
      this.$sourceSpinner.removeClass('-start');
      if (params.section) {
        this.section = true;
        this.model.set('section', params.section);
        this.model.set('interesting', params.interesting);
        (params.t) ? this.model.set('t', params.t) : null;
      }else{
        this.section = false;
        (!this.mobile) ? this.model.set('section', this.$navItem.eq(0).data('slug')) : null;
        this.model.set('interesting', this.$navItem.eq(0).data('interesting'));
      }
      mps.publish('Interesting/update',[this.model.get('interesting')]);
      this.changeHelper();
    },

    changeHelper: function(){
      var section = this.model.get('section'), tab = this.model.get('t'), $tab = $('#'+tab);
      var time = (this.first) ? 250 : 0;
      // mobile
      if (this.mobile) {
        if (section) {
          this.padding = 0;
          this.$backBtn.addClass('active');
          this.$htmlbody.addClass('active');
          this.$headerH1.addClass('active');
          this.$sideBarBox.addClass('active')
        }
      }else{
        this.padding = 40;
        this.$htmlbody.removeClass('active');
        this.$headerH1.removeClass('active');
        this.$sideBarBox.addClass('active');
      }

      //aside
      this.$navItem.removeClass('selected');
      $('.'+section).addClass('selected');

      //section
      this.$sourceArticle.removeClass('selected');
      $('#'+section).addClass('selected');

      //tab
      if (tab) {
        if (this.mobile) {
          this.$sideBarBox.animate({ scrollTop: $tab.offset().top - this.$backBtn.innerHeight() },0, _.bind(function(){
            $tab.find('.source_header').addClass('active');
            $tab.find('.source_body').show(0);
            this.calculateOffsets();
          }, this ));
        }else{
          this.$htmlbody.animate({ scrollTop: $tab.offset().top },0, _.bind(function(){
            $tab.find('.source_header').addClass('active');
            $tab.find('.source_body').show(0);
            this.calculateOffsets();
          }, this ));
        }
      }else{
        if (this.section) {
          this.$htmlbody.delay(time).animate({ scrollTop: this.$sideBarBox.offset().top - this.padding },time, _.bind(function(){
            this.calculateOffsets();
          }, this ));
        }else{
          this.calculateOffsets();
        }
      }
      this.section = true;
      this.first = false;
    },

    showSubContent:function(e){
      e && e.preventDefault();
      $(e.currentTarget).parents('.source_dropdown').find('.source_dropdown_menu').hide(0);

      var text = $(e.currentTarget).text();
      var id = $(e.currentTarget).data('slug');
      $(e.currentTarget).parents('.source_dropdown').find('.source_dropdown_header').find('.overview_title').children('span').text(text);

      $('.source_dropdown_body').hide(0);
      $('#'+id).show(0);

      this.calculateOffsets();
    },


    returnBack: function(e){
      e && e.preventDefault();

      this.$headerH1.removeClass('active');
      this.$sideBarBox.removeClass('active');
      this.$backBtn.removeClass('active');
      this.$navItem.removeClass('selected');

      this.$htmlbody.removeClass('active').animate({ scrollTop: this.$sideBarAside.offset().top },0);

    },

    scrollTo: function(e){
      e && e.preventDefault();
      this.$htmlbody.animate({ scrollTop: 0 },500);
    }


  });

  return SidebarNavView;

});
