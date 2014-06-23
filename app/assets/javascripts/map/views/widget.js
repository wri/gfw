/**
 * Widget module. To be extend by all widgets on the map.
 *
 * @return the Widget class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'jqueryui'
], function(Backbone, _, jqueryui) {

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
    },

    toggleDraggable: function() {
      if (this.model.get('draggable')) {
        this.$el.draggable({containment: this.model.get('containment')});
      } else {
        this.$el.draggable({disabled: true});
      }
    },

    toggleOpen: function(e) {
      this.model.get('closed') ? this.open() : this.close();
    },

    toggleHidden: function(e) {
      this.model.get('hidden') ? this.hide() : this.show();
    },

    open: function() {
      this.model.set('closed', false, {silent: true});
      this.$el.removeClass('closed');
    },

    close: function() {
      this.model.set('closed', true, {silent: true});
      this.$el.addClass('closed');
    },

    show: function() {
      this.model.set('hidden', false, {silent: true});
      this.$el.show();
    },

    hide: function() {
      this.model.set('hidden', true, {silent: true});
      this.$el.hide();
    },

    update: function() {
    }

  });

  return Widget;

});