
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
      var slideElems = ['#SFGSliderView', '#GrantesForestSliderView'],
        slideOptions = {
          options: {
            defaultSlider: {
              infinite: false,
              navigation: false
            }
          }
        };

      slideElems.forEach(function(elem) {
        Object.assign(slideOptions, {el: elem});
        new SliderView(slideOptions);
      });
    }

  });

  return SmallGrantsFundView;

});
