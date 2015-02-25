/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps'
], function($,Backbone, _,mps) {

  'use strict';

  var SourceWindowModel = Backbone.Model.extend({
    defaults: {
      hidden: true
    }
  });

  var SourceWindowView = Backbone.View.extend({

    el: 'body',

    events: {
      'click .source' : 'show',
      'click .close': 'hide'
    },

    initialize: function() {
      // Model
      this.model = new SourceWindowModel();

      // Cache
      this.$sourceWindow = $('#window');
      this.$backdrop = $('#backdrop');

      // Init
      this.render();
      this.model.on("change:hidden", this._toggle, this);
    },

    _initBindings: function() {
      // document keyup
      $(document).on('keyup', _.bind(function(e) {
        if (e.keyCode === 27) {
          this.hide();
        }
      },this));
      // backdrop
      this.$backdrop.on('click', _.bind(function() {
        this.hide();
      },this));
    },

    _stopBindings: function() {
      $(document).off('keyup');
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
      e && e.stopPropagation() && e.preventDefault();
      this.model.set('hidden', false);
      this.$contentWrapper.animate({ scrollTop: 0 }, 0);
      var data_slug = $(e.currentTarget).data('source');
      this.$content.html($('#' + data_slug).clone());
      return this;
    },

    showByParam: function(data_slug){
      this.model.set('hidden', false);
      this.$content.html($('#' + data_slug).clone());
      return this;
    },

    render: function() {
      this.$content = this.$sourceWindow.find('.content');
      this.$contentWrapper = this.$sourceWindow.find('.content-wrapper');
      this.$close = this.$sourceWindow.find('.close');
      return this.$sourceWindow;
    }
  });
  return SourceWindowView;
});
