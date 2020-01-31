/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'landing/views/SliderView'
], function($, Backbone, _, SliderView) {

  'use strict';

  var SummaryView = Backbone.View.extend({

    el: '.c-home-summary',

    events: {
      'click .js-home-summary-item-linker': '_onClickItem'
    },

    initialize: function() {
      this._initSlider();
    },

    _initSlider: function(){
      new SliderView({
        el: this.$el.find('.js_slider'),
        sliderOptions: {
          slideSpeed: 500
        }
      });
    },

    _onClickItem: function (e) {
      var trackLabel = $(e.currentTarget).data('text');
      ga('send', 'event', 'Home', 'Calls to action', trackLabel);
    },

  });
  return SummaryView;

});