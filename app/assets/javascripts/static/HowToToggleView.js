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
      this.desktop = $('.sources');
      this.mobile = $('.sources-m');


      this.render();
    },

    //hide view-global-data and view-country-data
    //show view-global-data-m and view-country-data-m
    //change tags of desktop to span, tags of mobile to strong
    toggle: function(e) {
      if ($(e.currentTarget).hasClass('active') != true){

        //make the other one inactive
        this.$el.find('span').removeClass('active');

        //make clicked element active
        $(e.currentTarget).addClass('active');

        //wenn auf mobile geklickt wurde
        if ($(e.currentTarget).data('classname') == 'mobile'){
          this.desktop.addClass('hide');
          this.mobile.removeClass('hide');
        }else{
          this.mobile.addClass('hide');
          this.desktop.removeClass('hide');
        }
      }


    },


    render: function(){
      this.$el.html(this.template());

    }

  });

  return HowToToggleView;

});
