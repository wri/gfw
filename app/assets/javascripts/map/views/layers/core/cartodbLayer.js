/**
 * The Cartodb map layer module.
 * 
 * @return CartodbLayer class (extends Backbone.View).
 */
define([
  'backbone',
  'mps',
  'views/map',
  'presenter',
  'wax'
], function(Backbone, mps, map, presenter, wax) {

  var CartodbLayer = Backbone.View.extend({
    initialize: function() {
      this.layer = {};
      this.layerOrder = this.layerOrder || 1;
      this.rendered = false;
    },

    render: function() {
      if (this.rendered) return;

      this.layer = new CartoDBLayer({
        map: map.map,
        user_name: '',
        tiler_domain: this.url,
        sql_domain: this.url,
        extra_params: { v: this.global_version},
        tiler_path: '/tiles/',
        tiler_suffix: '.png',
        tiler_grid: '.grid.json',
        table_name: this.table,
        query: this.getQuery(),
        layer_order: this.layerOrder,
        opacity: 1,
        interactivity: "cartodb_id",
        debug: false,
        auto_bound: false
      });

      this.rendered = true;
    },

    updateTiles: function() {
      this.layer.setQuery(this.getQuery());
    },

    getQuery: function() {
      var timelineDate = presenter.get('timelineDate') || this.timeline.opts.dateRange;

      var sql = "SELECT * FROM " +
                this.table +
                " WHERE date between '" +
                timelineDate[0].year() +
                "-" +
                //timelineDate[0].month() +
                "1-1' AND '" +
                timelineDate[1].year() +
                "-" +
                //timelineDate[1].month() +
                "1-1'";

      return sql;
     },

    removeLayer: function() {
      mps.publish('map/remove-layer', [this.name]);
      this.rendered = false;
    }

  });

  return CartodbLayer;
});