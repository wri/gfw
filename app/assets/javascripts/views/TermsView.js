/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'views/SourceWindowView'
], function($,Backbone, _,mps,SourceWindowView) {

  'use strict';

  var TermsView = Backbone.View.extend({

    el: 'body',

    events: {
      'click .continue'  : '_onClickContinue',
      'click .cancel'    : '_onClickCancel',
      'click .why_terms' : '_onClickWhyTerms'
    },

    initialize: function() {
      this.sourceWindow  = new SourceWindowView();
    },

    _onClickContinue: function(e) {
      e.preventDefault();

      ga('send', 'event', 'Terms', 'Click', 'I agree');

      var source = $(e.target).closest('.continue').attr('data-source');

      this.sourceWindow.showByParam(source);
      // this.sourceWindow.$el.find('.close').hide();

      this.sourceWindow.$el.find('.accept_btn').on('click', function() {
        ga('send', 'event', 'Terms', 'Click', 'I agree (Dialog)');
      });

      this.sourceWindow.$el.find('.cancel_btn').on('click', function(e) {
        ga('send', 'event', 'Terms', 'Click', 'I do not agree (Dialog)');
        window.location = $(e.currentTarget).data('href');
      });
    },

    _onClickCancel: function(e) {
      e.preventDefault();
      ga('send', 'event', 'Terms', 'Click', 'I do not agree');
      console.log('hey!');
    },

    _onClickWhyTerms: function(e) {
      e.preventDefault();
      var source = $(e.target).closest('.why_terms').attr('data-source');
      this.sourceWindow.showByParam(source);
      ga('send', 'event', 'Terms', 'Click', 'Why terms (Dialog)');
    }
  });

  return TermsView;

});

