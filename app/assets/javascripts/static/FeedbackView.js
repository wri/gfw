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
      'submit' : 'onSubmit',
      'change .radio-box input' : 'onChange',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.$textarea = $('#feedback-textarea');
      this.$email = $('#feedback-email');
    },

    onSubmit: function(e){
      e && e.preventDefault();
      //Check if any input are filled.
      if (this.$textarea.val() || this.$email.val()) {
        e.currentTarget.submit();
      }
    },

    onChange: function(e) {
      e && e.preventDefault();
      ($(e.currentTarget).val() === 'true') ? this.$email.attr('required', true) : this.$email.removeAttr('required');
    },

  });

  return FeedbackView;

});

