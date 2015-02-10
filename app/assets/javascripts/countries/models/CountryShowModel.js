/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'd3',
  'mps'
], function($, Backbone, _, d3, mps) {

  'use strict';
  var CountryArea = Backbone.Model.extend({});
  var CountryAreas = Backbone.Collection.extend({
    model: CountryArea
  });


  var CountryShowModel = Backbone.Model.extend({
    initialize: function() {
    },

    url: function() {
      return "http://wri-01.cartodb.com/api/v2/sql?q=SELECT  gadm_1_all.cartodb_id,  gadm_1_all.iso,  gadm_1_all.bounds,  gadm2_provinces_simple.id_1, gadm2_provinces_simple.name_1 as name_1  FROM gadm_1_all, gadm2_provinces_simple where  gadm_1_all.iso = '" + this.get('iso') + "' AND  gadm2_provinces_simple.iso = '" + this.get('iso') + "' AND gadm2_provinces_simple.id_1 = gadm_1_all.id_1 order by id_1 asc";
    },

    parse: function(response, options) {
      var collection = new CountryAreas();

      _.each(response.rows, function(row) {
        var bounds = JSON.parse(row.bounds),
            geojson = L.geoJson(bounds);

        collection.add(new CountryArea({
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

  return CountryShowModel;

});




