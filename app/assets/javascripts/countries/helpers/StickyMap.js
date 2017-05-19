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
      var body = document.getElementsByTagName('body')[0];
      var map = document.getElementById('map');
      var widgets = document.getElementById('widgets');
      var top = document.getElementById('map').offsetTop;
      var dashboard = $('.dashboard');
      var footerHeight = ($('.call-actions-wrapper').height()) + ($('#footerGfw').height());
      var bottomDistance = (body.offsetHeight) - (widgets.offsetTop + widgets.offsetHeight);
      var windowProperties = $(window);
      var limitFooter = $(body).height() - (bottomDistance + $(window).height())
      var y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      
      if(window.scrollY > limitFooter) {
        $(dashboard).addClass('relative');
        $(map).removeClass('stick');
        $(map).addClass('absolute');
        $(widgets).addClass('stick');
      } else {
        if (y >= top) {
            $(map).removeClass('absolute');
            $(map).addClass('stick');
            $(dashboard).removeClass('relative');
            $(widgets).addClass('stick');
        }
        else {
            $(map).removeClass('stick');
            $(widgets).removeClass('stick');
        }
      }

      $(window).bind('scroll', function () {
        var limitFooter = $(body).height() - (bottomDistance + $(window).height())
        var y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if(window.scrollY > limitFooter) {
          $(dashboard).addClass('relative');
          $(map).removeClass('stick');
          $(map).addClass('absolute');
          $(widgets).addClass('stick');
        } else {
          if (y >= top) {
              $(map).removeClass('absolute');
              $(map).addClass('stick');
              $(dashboard).removeClass('relative');
              $(widgets).addClass('stick');
          }
          else {
              $(map).removeClass('stick');
              $(widgets).removeClass('stick');
          }
        }
      });

      this.render();
    },

    render: function() {

    },
  });
  return StickyMap;

});
