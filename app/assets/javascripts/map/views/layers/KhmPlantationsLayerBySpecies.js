/**
 * The Plantations layer module.
 *
 * @return PlantationsLayerBySpecies class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/plantations_by_species.cartocss'

], function(CartoDBLayerClass, plantationsCartocss) {

  'use strict';

  var KhmPlantationsLayerBySpecies = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, type_text, spec_org, spec_simp, round(area_ha::numeric,1) as area_ha, percent, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      cartocss: plantationsCartocss,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, analysis, type_text, spec_org, spec_simp, area_ha, percent',
      analysis: true,

    },

  });

  return KhmPlantationsLayerBySpecies;

});