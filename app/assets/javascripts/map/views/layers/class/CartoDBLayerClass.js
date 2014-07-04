/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  'text!cartocss/style.cartocss'
], function(Class, _, CARTOCSS) {

  var CartoDBLayerClass = Class.extend({

    init: function(layer, map) {
      this.layer = {};
      this.map = map;
      this.name = layer.slug;
      this.layerOrder = this.layerOrder || 1;
    },

    render: function() {
      cartodb.createLayer(this.map, {
        user_name: 'wri-01',
        type: 'cartodb',
        sublayers: [{
          sql: this.getQuery(),
          cartocss: CARTOCSS,
          interactivity: 'cartodb_id'
        }]
      })
        .addTo(this.map, this.layerOrder)
        .done(
          _.bind(function(layer) {
            this.layer = layer;
          }, this)
        ).error(function(err) {
          throw err;
        });
    },

    updateTiles: function() {
      this.layer.setQuery(this.getQuery());
    },

    getQuery: function() {
      return this.options.sql;
    }

  });

  return CartoDBLayerClass;
});
