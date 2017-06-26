define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  tpl) {

  'use strict';

  var StickyMap = Backbone.View.extend({

    initialize: function() {
      this.body = document.getElementsByTagName('body')[0];
      this.map = document.getElementById('map');
      this.legendBox = $('.country-page-legend');
      this.zoomControl = $('.container-zoom-buttons');
      this.widgets = document.getElementById('widgets');
      this.top = document.getElementById('map').offsetTop;
      this.$dashboard = $('.dashboard');
      this.bottomDistance = (this.body.offsetHeight) - (this.widgets.offsetTop + this.widgets.offsetHeight);

      $(window).scroll(function() {
        this.setScroll();
      }.bind(this));

      this.setScroll();
    },

    setScroll: function() {
      var limitFooter = $(this.body).height() - (this.bottomDistance + $(window).height())
      var y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

      if(window.scrollY > limitFooter) {
        this.$dashboard.addClass('relative');
        $(this.map).removeClass('stick');
        $(this.map).addClass('absolute');
        $(this.widgets).addClass('stick');
      } else {
        if (y >= this.top) {
          $(this.map).removeClass('absolute');
          $(this.map).addClass('stick');
          $(this.zoomControl).removeClass('-top');
          this.$dashboard.removeClass('relative');
          $(this.widgets).addClass('stick');
        }
        else {
          $(this.zoomControl).addClass('-top');
          $(this.map).removeClass('stick');
          $(this.widgets).removeClass('stick');
        }
      }
    }
  });
  return StickyMap;

});
