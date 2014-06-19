/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenter',
  'mps',
  'text!layers_menu.html'
], function(Backbone, _, presenter, mps, layersMenuTpl) {

  var LayersMenu = Backbone.View.extend({

    el: $('.layers-menu'),
    template: _.template(layersMenuTpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    }

  });

  var layersMenu = new LayersMenu();

  return layersMenu;

});