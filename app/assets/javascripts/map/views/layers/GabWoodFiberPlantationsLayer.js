/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GabWoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'gab_wood_fiber\' as tablename, cartodb_id, the_geom_webmercator, nom_planta as name, operateur as company, sup_sig as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }

  });

  return GabWoodFiberPlantationsLayer;

});