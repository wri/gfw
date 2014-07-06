/**
 * Widget module. To be extend by all widgets on the map.
 *
 * @return the Widget class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'jqueryui'
], function(Backbone, _) {

  'use strict';

  var Widget = Backbone.View.extend({

    events: {
      'click .widget-toggle': 'toggleClosed'
    },

    initialize: function() {
      this.model = new (Backbone.Model.extend())();

      // Presenter listeners
      this.model.bind('change:closed',    this.setClosed, this);
      this.model.bind('change:hidden',    this.setHidden, this);
      this.model.bind('change:draggable', this.toggleDraggable, this);

      // Set presenter
      this.widgetOpts = _.extend({
        draggable: true,
        closed: true,
        hidden: false,
        containment: '.map-container'
      }, this.widgetOpts);

      this.render();
      this.model.set(this.widgetOpts);
    },

    render: function() {
      this.$el.html(this.template());
      $('.map-container').append(this.el);

      this.$widgetClosed = this.$el.find('.widget-closed');
      this.$widgetOpened = this.$el.find('.widget-opened');
    },

    toggleDraggable: function() {
      if (this.model.get('draggable')) {
        this.$el.draggable({containment: this.model.get('containment')});
      } else {
        this.$el.draggable({disabled: true});
      }
    },

    toggleClosed: function() {
      this.model.set('closed', !this.model.get('closed'));
    },

    setHidden: function() {
      this.model.get('hidden') ? this.$el.hide() : this.$el.show();
    },

    setClosed: function() {
      this.model.get('closed') ? this.close() : this.open();
    },

    open: function() {
      this.$el.removeClass('closed');
      this.$widgetClosed.hide();
      this.$widgetOpened.show();
    },

    close: function() {
      this.$el.addClass('closed');
      this.$widgetClosed.show();
      this.$widgetOpened.hide();
    },

  });

  return Widget;

});
