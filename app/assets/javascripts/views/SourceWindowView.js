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
    
    el: '#source-window-modal',

    events: {
      'click .close': 'hide'
    },

    initialize: function() {
      // Model
      this.model = new SourceWindowModel();
      
      // Cache
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
        this.$el.removeClass('active');
        this.$backdrop.removeClass('active');
      } else if (this.model.get('hidden') === false) {
        this._initBindings();
        this.$el.addClass('active');
        this.$backdrop.addClass('active');
      }
    },

    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);
      return this;
    },

    show: function(data_slug, data_coverage) {
      this.model.set('hidden', false);
      this.$content.html($('#' + data_slug).clone());

      return this;
    },

    render: function() {
      this.$content = this.$el.find('.content');
      this.$close = this.$el.find('.close');
      return this.$el;
    }
  });
  return SourceWindowView;
});