/**
 * The Plantations layer module.
 *
 * @return PlantationsLayerByType class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/plantations_by_type.cartocss'

], function(CartoDBLayerClass, plantationsCartocss) {

  'use strict';

  var PlantationsLayerByType = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, type_text, spec_org, spec_simp, percent, round(area_ha::numeric,1) as area_ha, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      cartocss: plantationsCartocss,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, analysis, type_text, spec_org, spec_simp, percent, area_ha',
      analysis: true,

    },

  });

  return PlantationsLayerByType;

});
