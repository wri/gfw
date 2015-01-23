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
      'click #back-btn' : 'returnBack',
      'click .source_header' : 'toggleSources',
      'click .source_dropdown_header' : 'toggleDropdown',
      'click .source_dropdown_menu a' : 'showSubContent'
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

    changeSourceNav: function(e){
      e && e.preventDefault();
      this.model.set('section',$(e.currentTarget).data('slug'));
      this.model.set('interesting', $(e.currentTarget).data('interesting'));
      this.model.set('t',null);

      this.updateSource()
    },
    toggleSources: function(e){
      this.$sourceBody.hide(0);
      if ($(e.currentTarget).hasClass('active')) {
        this.$sourceBody.removeClass('active');
        $(e.currentTarget).removeClass('active');
        this.model.set('t', null);
      } else {
        this.$sourceHeader.removeClass('active');
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).parent().children('.source_body').show(0);
        this.model.set('t', $(e.currentTarget).parent().attr('id'));
      }
      this.updateSource();
    },
    toggleDropdown: function(e){
      e && e.preventDefault();
      $(e.currentTarget).parents('.source_dropdown').find('.source_dropdown_menu').toggle(0);
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
      this.$sourceSpinner.removeClass('start');
      if (params.section) {
        this.model.set('section', params.section);
        this.model.set('interesting', params.interesting);
        (params.t) ? this.model.set('t', params.t) : null;
        this.changeHelper();
        mps.publish('Interesting/update',[this.model.get('interesting')]);
      }else{
        if (!this.mobile) {
          var section = this.$navItem.eq(0).data('slug');
          this.first = false;
          this.model.set('section', section);
          this.changeHelper();
        }
        var interesting = this.$navItem.eq(0).data('interesting');
        this.model.set('interesting', interesting);
        mps.publish('Interesting/update',[interesting]);
      }

    },

    changeHelper: function(){
      var section = this.model.get('section');
      var tab = this.model.get('t');
      this.$sideBarBox.addClass('active');
      this.$backBtn.addClass('active');
      //aside
      this.$navItem.removeClass('selected');
      $('.'+section).addClass('selected');

      //section
      this.$sourceArticle.removeClass('selected');
      $('#'+section).addClass('selected');

      //tab
      if (tab) {
        (!$('#'+tab).find('.source_header').hasClass('active')) ? $('#'+tab).find('.source_header').trigger('click') : null;
      }

      if(this.mobile) {
        this.$sideBarBox.animate({ scrollTop: 0 },0);
        this.$headerH1.addClass('active');
      }

      setTimeout(_.bind(function(){
        this.calculateOffsets();
        var posY, time;
        if (this.first) {
          if(this.mobile) {
            posY = this.$document.scrollTop();
            time = 0;
          }else{
            if(!tab) {
              posY = this.$sideBarBox.offset().top - this.padding
              time = 125;
            }else{
              posY = $('#'+tab).offset().top;
              time = 125;
            }
          }
          this.$htmlbody.animate({ scrollTop: posY },time);
        }else{
          this.first = true;
        }
      },this),100);

      setTimeout(_.bind(function(){
        //htmlbody
        if(this.mobile) {
          this.$sideBarBox.addClass('animate');
          this.$htmlbody.addClass('active');
        }
      },this),500);
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
