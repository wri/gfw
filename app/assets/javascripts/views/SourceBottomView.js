/**
 * The Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'presenters/SourceBottomPresenter',
  'text!templates/sourcebottom.handlebars'
], function($,Backbone, _, Handlebars, mps, Presenter, tpl) {

  'use strict';

  var SourceMobileFriendlyModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      name: '',
      text: 'default'
    }
  });

  var SourceMobileFriendlyView = Backbone.View.extend({

    el: 'body',

    template: Handlebars.compile(tpl),

    texts: {
      default: {
        title: "Do you want to locate your position on the map?"
      }
    },

    events: {
      'click #window-bottom .close': 'setResponse',
      'click #window-bottom .continue': 'setResponse'
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
        // this._stopBindings();
        this.$sourceWindow.removeClass('active');
      } else if (this.model.get('hidden') === false) {
        // this._initBindings();
        this.$sourceWindow.addClass('active');
      }
    },

    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);
      return this;
    },

    showByParam: function(_text, _name) {
      this.model.set('text', _text);
      this.model.set('name', _name);
      this.render();
      this.model.set('hidden', false);
    },

    setResponse: function(e) {
      var response = ($(e.currentTarget).hasClass('continue')) ? true : false;
      this.hide();
      this.presenter.sendResponse(this.model.get('name'), response);
    },

    render: function(){
      this.$sourceWindow.find('.content-wrapper').html(this.template({
        texts : this.texts[this.model.get('text')]
      }))
    }

  });
  return SourceMobileFriendlyView;
});
