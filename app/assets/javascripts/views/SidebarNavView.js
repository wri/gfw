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
      'click .nav-item' : 'updateSource'
    },

    initialize: function() {
      //CACHE
      this.$window = $(window);
      this.$htmlbody = $('html,body');  

      this.setListeners();
    },

    setListeners: function(){
      mps.subscribe('SourceStatic/change',this.changeSource);
    },

    updateSource: function(e){
      e && e.preventDefault();
      console.log('click');
      $(e.currentTarget).addClass('selected').siblings().removeClass('selected');
      
      var params = {
        section: $(e.currentTarget).data('slug')
      }
      
      mps.publish('SourceStatic/update',[params]);
    },

    changeSource: function(section){
      $('#'+section).addClass('selected').siblings().removeClass('selected');
    }


  });

  return SidebarNavView;

});
