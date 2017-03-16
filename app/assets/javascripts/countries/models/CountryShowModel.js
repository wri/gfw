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
    initialize: function(data, opt) {
      this.set('iso', opt.iso);
    },

    parse: function(response, options) {
      var collection = new CountryAreas();

      _.each(response, function(row) {
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
