/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'mps'
], function($,Backbone,mps) {

  'use strict';

  var FeedbackView = Backbone.View.extend({

    el: '#feedbackView',

    events: {
      'change .radio-box input' : 'onChange',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.$email = $('#feedback-email');
    },

    onChange: function(e) {
      e && e.preventDefault();
      ($(e.currentTarget).val() === 'true') ? this.$email.attr('required', true) : this.$email.removeAttr('required');
    },

  });

  return FeedbackView;

});

