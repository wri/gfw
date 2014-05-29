gfw.ui.model.Country = cdb.core.Model.extend({

  url: function() {
    return "http://wri-01.cartodb.com/api/v2/sql?q=SELECT iso,id_1,name_1 FROM gadm2_provinces where iso = '" + this.get('iso') + "' order by id_1 asc";
  },

  parse: function(response, options) {
    var collection = new gfw.ui.collection.CountryAreas()

    _.each(response.rows, function(row) {
      collection.add(new gfw.ui.model.CountryArea(row))
    });

    return {fields: response.fields, areas: collection }
  }

});