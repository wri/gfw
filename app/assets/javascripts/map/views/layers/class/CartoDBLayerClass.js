/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  'text!../../../../cartocss/styles.cartocss'
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
          console.log(err);
        });
    },

    updateTiles: function() {
      this.layer.setQuery(this.getQuery());
    },

    getQuery: function() {
      var sql = "SELECT * FROM " +
                this.options.table +
                " WHERE date between '" +
                //timelineDate[0].year() +
                "-" +
                //timelineDate[0].month() +
                "1-1' AND '" +
                //timelineDate[1].year() +
                "-" +
                //timelineDate[1].month() +
                "1-1'";

      return sql;
     }
  });

  return CartoDBLayerClass;
});
