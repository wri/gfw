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
      offset: null,
      height: null
    }
  });


  var SidebarNavView = Backbone.View.extend({

    el: '#sidebarNavView',

    events: {
      'click .nav-item' : 'updateSource',
      'click .nav-title' : 'scrollTo',
      'click .source_header' : 'toggleSources',
      'click .source_dropdown_header' : 'toggleDropdown'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //CACHE
      this.$window = $(window);
      this.$document = $(document);
      this.$htmlbody = $('html,body'); 
      this.$navItem = $('.nav-item');
      this.$sideBarAside = $('#sidebarAside');
      this.$sideBarBox = $('#sources-box');
      this.$sourceArticle = $('.source-article');
      this.$sourceHeader = $('.source_header');
      this.$sourceBody = $('.source_body');
      this.$cut = $('#cut');
      this.$sourceSpinner = $('#sources-spinner');

      //VARS
      this.padding = 40;
      this.first = true;
      

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
    },


    toggleDropdown: function(e){

    },


    toggleSources: function(e){
      this.$sourceBody.hide(0);
      this.$sourceHeader.removeClass('active');

      if(!$(e.currentTarget).hasClass('active')){
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).parent().children('.source_body').show(0);
      }

      this.$htmlbody.animate({ scrollTop: this.$sideBarBox.offset().top - this.padding },0);

      setTimeout(_.bind(function(){
        this.calculateOffsets();  
      },this),50);      
    },



    calculateOffsets: function(){
      this.$sideBarBox.css({'min-height': this.$sideBarAside.height() });
      this.offset = this.$el.offset().top + parseInt(this.$el.css('paddingTop'), 10);
      this.offsetBottom = this.$cut.offset().top - this.$sideBarAside.height() - this.padding;        
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

    updateSource: function(e){
      e && e.preventDefault();
      
      var params = {
        section: $(e.currentTarget).data('slug'),
        interesting: $(e.currentTarget).data('interesting')
      }
      
      mps.publish('SourceStatic/update',[params]);
    },

    changeSource: function(params){
      //spinner
      this.$sourceSpinner.removeClass('start');

      if(this.first){
        this.changeHelper(params.section);
        this.first = false;
      }else{
        this.$htmlbody.animate({ scrollTop: this.$sideBarBox.offset().top - this.padding },0, _.bind(function(){
          this.changeHelper(params.section);
        },this));
      }

      mps.publish('Interesting/update',[params.interesting]);
    },

    changeHelper: function(section){
      //aside
      this.$navItem.removeClass('selected');
      $('.'+section).addClass('selected');
      
      //section
      this.$sourceArticle.removeClass('selected');
      $('#'+section).addClass('selected');

      setTimeout(_.bind(function(){
        this.calculateOffsets();  
      },this),50);      
    },

    scrollTo: function(e){
      e && e.preventDefault();
      this.$htmlbody.animate({ scrollTop: 0 },500);
    }


  });

  return SidebarNavView;

});
