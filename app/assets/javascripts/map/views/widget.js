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
      'click .widget-toggle': 'toggleOpen'
    },

    initialize: function() {
      this.model = new (Backbone.Model.extend())();

      _.bindAll(this, 'update');

      // Presenter listeners
      this.model.bind('change:closed',    this.toggleOpen, this);
      this.model.bind('change:hidden',    this.toggleHidden, this);
      this.model.bind('change:draggable', this.toggleDraggable, this);

      // Set presenter
      this.opts = _.extend({
        draggable: true,
        closed: false,
        hidden: false,
        containment: '.map-container'
      }, this.opts);

      this.render();
      this.model.set(this.opts);
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

    toggleHidden: function() {
      this.model.get('hidden') ? this.$el.hide() : this.$el.show();
    },

    toggleOpen: function() {
      this.model.get('closed') ? this.open() : this.close();
    },

    open: function() {
      this.model.set('closed', false, {silent: true});
      this.$el.removeClass('closed');
      this.$widgetClosed.hide();
      this.$widgetOpened.show();
    },

    close: function() {
      this.model.set('closed', true, {silent: true});
      this.$el.addClass('closed');
      this.$widgetClosed.show();
      this.$widgetOpened.hide();
    },

    update: function() {
    }

  });

  return Widget;

});
