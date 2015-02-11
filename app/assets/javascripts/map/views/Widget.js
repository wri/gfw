/**
 * Widget class.
 *
 * Options:
 *   boxDraggable: .widget-box draggable
 *   boxHidden:    .widget-box toggle hidden
 *   boxClosed:    .widget-box toggle .widget-open/.widget-closed
 *   hidden:       .widget toggle hidden
 *
 * Template usage:
 *
 *   .widget
 *     .widget-btn (optional widget button)
 *     .widget-box
 *       .widget-toggle (optional toggle open/closed .widget-box)
 *       .widget-content
 *         .widget-open
 *         .widget-closed
 *
 * @return the Widget class (extends Backbone.View).
 */
define([
  'jqueryui',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  'use strict';

  var Widget = Backbone.View.extend({

    events: {
      'click .widget-toggle': '_toggleBoxClosed',
      'click .widget-btn': '_toggleBoxHidden'
    },

    renderParams: {},

    defaults: {
      boxDraggable: true,
      boxHidden: false,
      boxClosed: true,
      hidden: false,
      forceHidden: false,
      containment: '.map-container'
    },

    initialize: function() {
      this.options = _.extend({}, this.defaults, this.options || {});
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.renderParams));
      $(this.options.containment).append(this.el);
      this._cacheSelector();
      this._setModel();
    },

    _update: function(html) {
      var style = _.clone(this.$widgetBox.attr('style'));
      this.$el.html(html);
      this._cacheSelector();
      this.$widgetBox.attr('style', style);
      this._setModel(_.clone(this.model.toJSON()));
    },

    _cacheSelector: function() {
      this.$widgetBox = this.$el.find('.widget-box');
      this.$widgetBtn = this.$el.find('.widget-btn');
      this.$widgetToggle = this.$el.find('.widget-toggle');
      this.$widgetContent = this.$el.find('.widget-content');
      this.$widgetClosed = this.$el.find('.widget-closed');
      this.$widgetOpened = this.$el.find('.widget-opened');
    },

    _setModel: function(params) {
      this.model = new (Backbone.Model.extend())();
      this.model.bind('change:boxClosed',    this._setBoxClosed, this);
      this.model.bind('change:boxHidden',    this._setBoxHidden, this);
      this.model.bind('change:boxDraggable', this._setBoxDraggable, this);
      this.model.bind('change:hidden', this._setHidden, this);
      this.model.bind('change:forceHidden', this._setHidden, this);
      this.model.set(params || this.options);
    },

    _setBoxClosed: function() {
      this.model.get('boxClosed') ? this._closeBox() : this._openBox();
    },

    _setBoxHidden: function() {
      this.model.get('boxHidden') ? this.$widgetBox.hide() : this.$widgetBox.show();
    },

    _setBoxDraggable: function() {

      if (this.model.get('boxDraggable')) {
        var params = {};
        params.containment = this.model.get('containment');
        if (this.$widgetToggle.length) {
          params.cancel = this.$widgetToggle.selector;
        }
        this.$widgetBox.draggable(params);
      } else {
        if (this.$widgetBox.hasClass('ui-dragabble')) {
          this.$widgetBox.draggable('destroy');
        }
      }

    },

    _setHidden: function() {
      if (this.model.get('hidden')) {
        this.$el.hide();
      } else {
        if(!this.model.get('forceHidden')) {
          this.$el.show();
        }
      }
    },

    _toggleBoxClosed: function() {
      this.model.set('boxClosed', !this.model.get('boxClosed'));
    },

    _toggleBoxHidden: function(e) {
      e && e.preventDefault();
      this.model.set('boxHidden', !this.model.get('boxHidden'));
    },

    _openBox: function() {
      this.$widgetBox.removeClass('closed');
      this.$widgetClosed.hide();
      this.$widgetOpened.show();
    },

    _closeBox: function() {
      this.$widgetBox.addClass('closed');
      this.$widgetClosed.show();
      this.$widgetOpened.hide();
    },

  });

  return Widget;

});
