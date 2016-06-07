/**
 * Application entry point.
 */
require([
  'jquery',
  'Class',
  'Backbone',
  'static-pages/SliderView',
], function($, Class, Backbone, SliderView) {

  'use strict';

  var StaticPage = Class.extend({

    $el: $('body'),

    init: function() {

      this._initViews();
      this._initApp();
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      new SliderView({
        el: '#stepsSliderView',
        options: {
          defaultSlider: {
            infinite: false,
            navigation: false
          }
        }
      });
    }

  });

  new StaticPage();

});
