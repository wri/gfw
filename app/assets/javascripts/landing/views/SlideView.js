/**
 * The Slide view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'enquire',
  'handlebars',
], function($,Backbone, _,mps, enquire, Handlebars) {

  'use strict';

  // SLIDER
  var SlideView = Backbone.View.extend({

    el: '#main-slider',

    events: {
      'click #get-started' : 'getStarted',
      'click #go-to-apps' : 'goToApps',
      'click .gotomap' : 'gotoMap'
    },

    initialize: function() {
      //Init
      this.$getStarted = $('#get-started');

      //Inits
      this.slickSlider();
    },

    slickSlider: function(){
      //INIT
      $('.main-slider-viewport').slick({
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slide: 'li',
        fade: true,
        cssEase: 'linear',
        dots: true,
        pauseOnHover: false,
        arrows: false,

        responsive: [
          {
            breakpoint: 850,
            settings: {
              fade: false,
              cssEase: 'ease-out'
            }
          }
        ]
      });

    },

    getStarted: function(e){
      e.stopPropagation();
      $(e.currentTarget).toggleClass('active');
    },

    /**
     * Closes submenu tooltip
     * Check the click target is not the dialog itself.
     *
     * @param  {Object} e Event
     */
    _onHtmlClick: function(e) {
      if (!$(e.target).hasClass('submenu-tooltip') && this.$getStarted.hasClass('active')) {
        this.$getStarted.removeClass('active');
      }
    },


    goToApps: function(e){
      e.preventDefault();
      var posY = $($(e.currentTarget).attr('href')).offset().top;
      $('html,body').animate({scrollTop: posY},500);
    },

    gotoMap: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $target = $(e.target);

      if (!$(e.target).hasClass('gotomap')) {
        $target = $(e.target).parent();
      }

      if ($target.data('dialog')) {
        var dialog = JSON.stringify(
        {
          "display": true,
          "type" : $target.data('dialog')
        });

        sessionStorage.setItem('DIALOG', dialog);
      }
      ga('send', 'event', 'Get Started', 'Click', $target.data('ga'));
      window.setTimeout(function(){location.assign($target.attr('href'));20});
    }

  });

  return SlideView;

});
