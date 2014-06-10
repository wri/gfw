gfw.ui.model.Country = cdb.core.Model.extend({

  initialize: function() {
  },

  url: function() {
    return "http://wri-01.cartodb.com/api/v2/sql?q=SELECT cartodb_id, iso, id_1, name_1, bounds FROM gadm_1_all where iso = '" + this.get('iso') + "' order by id_1 asc";
  },

  parse: function(response, options) {
    var collection = new gfw.ui.collection.CountryAreas();

    _.each(response.rows, function(row) {
      var bounds = JSON.parse(row.bounds),
          geojson = L.geoJson(bounds);

      collection.add(new gfw.ui.model.CountryArea({
        cartodb_id: row.cartodb_id,
        iso: row.iso,
        id_1: row.id_1,
        name_1: row.name_1,
        bounds: geojson.getBounds()
      }))
    });

    return {fields: response.fields, areas: collection}
  }

});

gfw.ui.collection.CountryAreas = Backbone.Collection.extend({
  model: gfw.ui.model.CountryArea
});

gfw.ui.model.CountryArea = cdb.core.Model.extend({});