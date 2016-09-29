/**
 * The MapMiniSelectedView view.
 *
 * @return MapMiniSelectedView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'text!connect/templates/subscriptionNewDataSelection.handlebars',
], function(_, Handlebars, mps, tpl) {

  'use strict';

  var MapMiniSelectedView = Backbone.View.extend({
    model: new (Backbone.Model.extend({

    })),

    template: Handlebars.compile(tpl),

    el: '#map-selection',

    events: {
      'click .js-map-selection-delete' : 'onClickDeleteSelection'
    },

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      this.map = map;
      this.cache();
      this.listeners();
    },

    listeners: function() {
      this.model.on('change', this.render.bind(this));

      // HIGHLIGHT
      mps.subscribe('Highlight/shape', function(data){
        this.model.clear({ silent: true }).set(data);
      }.bind(this));
    },

    cache: function() {
    },

    /**
     * MODEL EVENTS
    */
    render: function() {
      this.$el.addClass('-active').html(this.template(this.model.toJSON()));
    },


    /**
     * UI EVENTS
    */
    onClickDeleteSelection: function(e) {
      e && e.preventDefault();
      this.$el.removeClass('-active');
      mps.publish('Drawing/delete');
      mps.publish('Params/reset');
    }
  });

  return MapMiniSelectedView;

});
