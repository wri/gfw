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

    initialize: function() {
      this.model = new (Backbone.Model.extend())();

      // Status listeners
      this.model.bind('change:closed',    this.toggleOpen, this);
      this.model.bind('change:draggable', this.toggleDraggable, this);

      this.opts = _.extend({
        draggable: true,
        closed: false,
        containment: '.map-container'
      }, this.opts);

      this.model.set(this.opts);
    },

    show: function() {
      this.$el.show();
    },

    hide: function() {
      this.$el.hide();
    },

    toggleDraggable: function() {
      if (this.model.get('draggable')) {
        this.$el.draggable({ containment: this.model.get('containment') });
      } else {
        this.$el.draggable({ disabled: true })
      }
    },

    toggleOpen: function() {
    }

  });

  return Widget;

});