var StaticGridLayerModel = cdb.core.Model.extend();

var StaticGridLayer = cdb.core.View.extend({

  hide: function() {
    this.model.set("opacity", 0);
  },

  show: function() {
    this.model.set("opacity", 1);
  },

  set_time: function(month, year) {
    month && this.model.set("month", month);
    year && this.model.set("year", year);

    this._onDateUpdate();
  },

  _onOpacityUpdate: function() {
    this.layer.setOpacity(this.model.get("opacity"));
  },

  _onDateUpdate: function() {
    var query = "SELECT * FROM " + this.options._table + " WHERE EXTRACT(YEAR FROM date) = " + this.model.get("year") + " AND EXTRACT(MONTH FROM date) = " + this.model.get("month");
    this.model.set("query", query);
    this.layer.setQuery(query);
  },

  cache_time: function() {

  },

  initialize: function() {
    var that = this;

    this.model = new StaticGridLayerModel({
      year: 2013,
      month: 06
    });

    this.model.bind("change:opacity", this._onOpacityUpdate, this);

    var query = "SELECT * FROM " + this.options._table + " WHERE EXTRACT(YEAR FROM date) = " + this.model.get("year") + " AND EXTRACT(MONTH FROM date) = " + this.model.get("month");
    this.model.set("query", query);

    this.layer = new CartoDBLayer({
      map: map,
      user_name:'',
      tiler_domain: that.options._cloudfront_url,
      sql_domain:   that.options._cloudfront_url,
      extra_params: { v: that.options._global_version}, //define a version number on requests
      tiler_path:'/tiles/',
      tiler_suffix:'.png',
      tiler_grid: '.grid.json',
      table_name: that.options._table,
      query: query,
      layer_order: "bottom",
      opacity: 1,
      interactivity:"cartodb_id",
      debug:false,
      auto_bound: false
    });
  }
});
