/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnWoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'idn_wood_fiber\' as tablename, cartodb_id, the_geom_webmercator, name, group_comp as company, area_ha, type, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, type, area_ha, analysis',
      analysis: false
    }

  });

  return IdnWoodFiberPlantationsLayer;

});