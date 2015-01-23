/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps'
], function($, Backbone, _, mps) {

  'use strict'; 

  var SpinnerView = Backbone.View.extend({

    el: '.spinner',

    initialize: function() {
      this.setListeners();
    },

    setListeners: function(){
      mps.subscribe('Spinner:start',_.bind(this.start,this));
      mps.subscribe('Spinner:stop',_.bind(this.stop,this));
    },

    start: function(){
      this.$el.addClass('start');
    },
    stop: function(){
      this.$el.removeClass('start');
    }

  });
  return SpinnerView;

});