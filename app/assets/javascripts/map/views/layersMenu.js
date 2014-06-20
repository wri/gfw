/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'text!layers_menu.html'
], function(Backbone, _, layersMenuTpl) {

  var LayersMenu = Backbone.View.extend({

    el: '.layers-menu',
    template: _.template(layersMenuTpl),

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
      var layerName = $(event.currentTarget).parent().data('layer');

      if (layerName) {
        mps.publish('presenter/toggle-layer', [layerName]);
      }
    },

  });

  var layersMenu = new LayersMenu();

  return layersMenu;

});