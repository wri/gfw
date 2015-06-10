/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'presenters/SourceMobileFriendlyPresenter',
  'text!templates/sourcemobilefriendly.handlebars'
], function($,Backbone, _, Handlebars, mps, Presenter, tpl) {

  'use strict';

  var SourceMobileFriendlyModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      link: '',
      text: 'default'
    }
  });

  var SourceMobileFriendlyView = Backbone.View.extend({

    el: 'body',

    template: Handlebars.compile(tpl),

    texts: {
      default: {
        title: "The page you're trying to access is not optimized for a mobile device"
      },
      other: {
        title: "The page you're trying to access may not be optimized for a mobile device"
      }
    },

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
      this.$htmlbody.removeClass('active');
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
        var text = $(e.currentTarget).data('text') || 'default';
        this.model.set('text', text);
        this.model.set('link', $(e.currentTarget).attr('href'));
        this.model.set('target', $(e.currentTarget).attr('target'));
        this.render();
        this.model.set('hidden', false);

      }
    },

    render: function(){
      this.$sourceWindow.find('.content-wrapper').html(this.template({ url: this.model.get('link'), target: this.model.get('target'), texts : this.texts[this.model.get('text')]}))
    }

  });
  return SourceMobileFriendlyView;
});
