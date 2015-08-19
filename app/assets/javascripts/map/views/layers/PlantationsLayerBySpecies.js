/**
 * The Plantations layer module.
 *
 * @return PlantationsLayerBySpecies class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/gfw_plantations.cartocss'

], function(CartoDBLayerClass, plantationsCartocss) {

  'use strict';

  var PlantationsLayerBySpecies = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, type_text, spec_org, percent, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      cartocss: plantationsCartocss,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, analysis, type_text, spec_org, percent',
      analysis: true,

    },

  });

  return PlantationsLayerBySpecies;

});
