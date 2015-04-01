/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'presenters/SourceMobileFriendlyPresenter',
], function($,Backbone, _,mps, Presenter) {

  'use strict';

  var SourceMobileFriendlyModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
    }
  });

  var SourceMobileFriendlyView = Backbone.View.extend({

    el: 'body',

    events: {
      'click .mobile-friendly' : 'show',
      'click .close': 'hide'
    },

    initialize: function() {
      // Model
      this.presenter = new Presenter(this);
      this.model = new SourceMobileFriendlyModel();

      // Cache
      this.$htmlbody = $('html, body');
      this.$window = $(window);
      this.$document = $(document);
      this.$setLink = $('#set-link');
      this.$sourceWindow = $('#window-bottom');
      this.$backdrop = $('#backdrop');

      // Init
      this.render();
      this.model.on("change:hidden", this._toggle, this);
    },

    _initBindings: function() {
      // backdrop
      this.$backdrop.on('click', _.bind(function() {
        this.hide();
      },this));
    },

    _stopBindings: function() {
      this.$backdrop.off('click');
    },

    _toggle: function() {
      if (this.model.get('hidden') === true) {
        this._stopBindings();
        this.$sourceWindow.removeClass('active');
        this.$backdrop.removeClass('active');
      } else if (this.model.get('hidden') === false) {
        this._initBindings();
        this.$sourceWindow.addClass('active');
        this.$backdrop.addClass('active');
      }
    },

    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);
      return this;
    },

    show: function(e) {
      if (this.$window.width() < 850) {
        e && e.preventDefault() && e.stopPropagation();
        this.model.set('hidden', false);
        var href = $(e.currentTarget).attr('href');
        this.$setLink.attr('href', href);
      }
    }

  });
  return SourceMobileFriendlyView;
});
