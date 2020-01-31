/**
 * The MapMiniSelectedView view.
 *
 * @return MapMiniSelectedView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'core/View',
  'text!connect/templates/subscriptionNewDataSelection.handlebars',
], function(_, Handlebars, mps, View, tpl) {

  'use strict';

  var MapMiniSelectedView = View.extend({
    model: new (Backbone.Model.extend({

    })),

    template: Handlebars.compile(tpl),

    el: '#map-selection',

    events: {
      'click .js-map-selection-delete' : 'onClickDeleteSelection'
    },

    initialize: function(map, params) {
      if (!this.$el.length) {
        return;
      }
      this.params = params;

      View.prototype.initialize.apply(this);

      this.map = map;
      this.cache();
      this.listeners();
      this._setParams();
    },

    _subscriptions: [
      // HIGHLIGHT
      {
        'Shape/update': function(data){
          this.model.clear({ silent: true }).set(data);
        }
      },

      {
        'MapSelection/clear': function(){
          this.clearSelection();
        }
      }
    ],

    listeners: function() {
      this.listenTo(this.model, 'change', this.render.bind(this));
    },

    cache: function() {
    },

    /**
     * Sets params from the URL
     */
    _setParams: function() {
      var data = this.params;

      if (data.metadata) {
        this.model.clear().set(JSON.parse(data.metadata));
      }
    },

    /**
     * MODEL EVENTS
    */
    render: function() {
      this.$el.addClass('-active').html(this.template(this.model.toJSON()));
    },


    /**
     * CHANGE EVENTS
     * - clearSelection
     */

    clearSelection: function() {
      this.model.clear();
      this.$el.removeClass('-active');
    },


    /**
     * UI EVENTS
    */
    onClickDeleteSelection: function(e) {
      e && e.preventDefault();
      this.$el.removeClass('-active');
      mps.publish('Drawing/delete');
      mps.publish('Selected/reset');
    }
  });

  return MapMiniSelectedView;

});
