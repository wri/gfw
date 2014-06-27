/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'text!map/templates/layersNav.html'
], function(Backbone, _, layersNavTpl) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',
    template: _.template(layersNavTpl),

    events: {
      'click .layer-title': 'onClickLayer',
      'click .radio': 'onClickLayer'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    },

    onClickLayer: function(event) {
      var layerName = $(event.currentTarget).parents('li').data('layer');

      if (layerName) {
        window.mps.publish('presenter/toggle-layer', [layerName]);
      }
    },

  });

  var layersNavView = new LayersNavView();

  return layersNavView;

});
