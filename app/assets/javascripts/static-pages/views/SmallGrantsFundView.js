
define([
  'backbone',
  'static-pages/views/SliderView'
], function(Backbone, SliderView) {

  'use strict';

  var SmallGrantsFundView = Backbone.View.extend({

    el: '#small-grunts-fund',

    initialize: function() {

      if(! !!this.el) {
        return;
      }

      this._setSlides();
    },

    _setSlides: function() {

      var sliders = [{
        slideOptions: {
          el: '#SFGSliderView',
          options: {
            defaultSlider: {
              autoplay: true,
              navigation: false
            }
          }
        }
      },{
        slideOptions: {
          el: '#GrantesForestSliderView',
          options: {
            defaultSlider: {
              infinite: false,
              navigation: false
            }
          }
        }
      }]

      sliders.forEach(function(slider) {
        new SliderView(slider.slideOptions);
      });
    }

  });

  return SmallGrantsFundView;

});
