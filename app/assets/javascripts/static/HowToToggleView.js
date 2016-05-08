/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'text!static/templates/howto-toggle.handlebars',

], function($,Backbone, Handlebars, mps, howToToggleTPL) {

  'use strict';

  var HowToToggleView = Backbone.View.extend({

    el: '.toggle-howto',

    events: {
      'click .toggle-choice' : 'toggle'
    },

    template: Handlebars.compile(howToToggleTPL),

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      //CACHE
      this.desktop = $('.howto-d');
      this.mobile = $('.howto-m');


      this.render();
      this.setListeners();
    },

    setListeners: function() {
      mps.subscribe('Howto/toggle', _.bind(function(mobile){
        this.toggleStates(mobile);
      }, this ))
    },

    //hide view-global-data and view-country-data
    //show view-global-data-m and view-country-data-m
    //change tags of desktop to span, tags of mobile to strong
    toggle: function(e) {
      if (!$(e.currentTarget).hasClass('active')){
        //wenn auf mobile geklickt wurde
        if ($(e.currentTarget).data('classname') == 'mobile'){
          mps.publish('Howto/toggle', [true])
        }else{
          mps.publish('Howto/toggle', [false])
        }
      }
    },

    toggleStates: function(mobile) {
      var $desktop = this.$el.find('span[data-classname="desktop"]');
      var $mobile = this.$el.find('span[data-classname="mobile"]');
      //wenn auf mobile geklickt wurde
      if (mobile){
        $mobile.addClass('active').siblings().removeClass('active');
        this.desktop.addClass('hide');
        this.mobile.removeClass('hide');
      }else{
        $desktop.addClass('active').siblings().removeClass('active');
        this.mobile.addClass('hide');
        this.desktop.removeClass('hide');
      }
    },

    render: function(){
      this.$el.html(this.template({ desktop: !isMobile.any, mobile: isMobile.any }));
    }

  });

  return HowToToggleView;

});
