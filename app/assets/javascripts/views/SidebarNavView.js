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

  var SidebarNavView = Backbone.View.extend({

    el: '#sidebarNavView',

    events: {
      'click .nav-item' : 'updateSource',
      'click .nav-title' : 'scrollTo'
    },

    initialize: function() {
      //CACHE
      this.$window = $(window);
      this.$htmlbody = $('html,body'); 

      this.$navItem = $('.nav-item');
      this.$sourceArticle = $('.source-article');
      this.$sourceSpinner = $('#sources-spinner');

      this.setListeners();
    },

    setListeners: function(){
      mps.subscribe('SourceStatic/change',_.bind(this.changeSource,this));
    },

    updateSource: function(e){
      e && e.preventDefault();
      
      var params = {
        section: $(e.currentTarget).data('slug')
      }
      
      mps.publish('SourceStatic/update',[params]);
    },

    changeSource: function(section){
      //spinner
      this.$sourceSpinner.removeClass('start');

      //aside
      this.$navItem.removeClass('selected');
      $('.'+section).addClass('selected');
      
      //section
      this.$sourceArticle.removeClass('selected');
      $('#'+section).addClass('selected')

    },

    scrollTo: function(e){
      e && e.preventDefault();
      this.$htmlbody.animate({ scrollTop: 0},500);
    }


  });

  return SidebarNavView;

});
