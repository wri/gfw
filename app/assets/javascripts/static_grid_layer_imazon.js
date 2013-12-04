var StaticGridLayerModelImazon = Backbone.Model.extend({ });

var StaticGridLayerImazon = Backbone.View.extend({

  hide: function() {
    this.model.set("opacity", 0);
  },

  show: function() {
    this.model.set("opacity", 1);
  },

  set_time: function(start_month, end_month, start_year, end_year) {
    start_month && this.model.set("start_month", start_month);
    end_month && this.model.set("end_month", end_month);
    start_year && this.model.set("start_year", start_year);
    end_year && this.model.set("end_year", end_year);

    this._onDateUpdate();
  },

  _onOpacityUpdate: function() {
    this.layer.setOpacity(this.model.get("opacity"));
  },

  _onDateUpdate: function() {
    var query = "SELECT * FROM " + this.options._table + " WHERE date between '" + this.model.get("start_year") + "-" + this.model.get("start_month") + "-1' AND '" + this.model.get("end_year") + "-" + this.model.get("end_month") + "-1'";
    this.model.set("query", query);
    this.layer.setQuery(query);
  },

  cache_time: function() {

  },

  initialize: function() {
    var that = this;

    this.model = new StaticGridLayerModelImazon({
      start_year: 2007,
      start_month: 1,
      end_year: 2013,
      end_month: 12
    });

    this.model.bind("change:opacity", this._onOpacityUpdate, this);

    var query = "SELECT * FROM " + this.options._table + " WHERE date between '" + this.model.get("start_year") + "-" + this.model.get("start_month") + "-1' AND '" + this.model.get("end_year") + "-" + this.model.get("end_month") + "-1'";
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
