/**
 * Widget module. To be extend by all widgets on the map.
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
      'click .widget-toggle': '_toggleClosed'
    },

    defaults: {
      draggable: true,
      closed: true,
      hidden: false,
      $containment: $('.map-container')
    },

    initialize: function() {
      this.options = _.extend({}, this.defaults, this.options || {});
      this.model = new (Backbone.Model.extend())();

      this.model.bind('change:closed',    this._setClosed, this);
      this.model.bind('change:hidden',    this._setHidden, this);
      this.model.bind('change:draggable', this._toggleDraggable, this);

      this.render();
      this.model.set(this.options);
    },

    render: function() {
      this.$el.html(this.template());
      this.options.$containment.append(this.el);

      // cache
      this.$widgetClosed = this.$el.find('.widget-closed');
      this.$widgetOpened = this.$el.find('.widget-opened');
    },

    _toggleDraggable: function() {
      if (this.model.get('draggable')) {
        this.$el.draggable({containment: this.model.get('containment')});
      } else {
        this.$el.draggable({disabled: true});
      }
    },

    _toggleClosed: function() {
      this.model.set('closed', !this.model.get('closed'));
    },

    _setHidden: function() {
      this.model.get('hidden') ? this.$el.hide() : this.$el.show();
    },

    _setClosed: function() {
      this.model.get('closed') ? this._close() : this._open();
    },

    _open: function() {
      this.$el.removeClass('closed');
      this.$widgetClosed.hide();
      this.$widgetOpened.show();
    },

    _close: function() {
      this.$el.addClass('closed');
      this.$widgetClosed.show();
      this.$widgetOpened.hide();
    },

  });

  return Widget;

});
