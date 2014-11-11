/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'landing/views/SlideView',
  'landing/views/FooterView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, mps, SlideView, FooterView, DialogView) {
  'use strict';

  var LandingPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      new SlideView();
      new FooterView();
    },


  });

  new LandingPage();

});

$('#google_translate_element').live("click", function () {

        // Change font family and color
        $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
            .css({
                'color': '#544F4B',
                'font-family': 'tahoma'
            });

        // Change hover effects
        $("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
            $(this).css('background-color', '#F38256').find('span.text').css('color', 'white');
        }, function () {
            $(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
        });

        // Change Google's default blue border
        $("iframe").contents().find('.goog-te-menu2').css('border', '1px solid #F38256');

        // Change the iframe's box shadow
        $(".goog-te-menu-frame").css({
            '-moz-box-shadow': '0 3px 8px 2px #666666',
            '-webkit-box-shadow': '0 3px 8px 2px #666',
            'box-shadow': '0 3px 8px 2px #666'
        });
    });