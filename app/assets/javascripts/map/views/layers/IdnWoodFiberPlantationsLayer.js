/**
 * The WoodFiber Concessions layer module (formerly called WoodFiber Plantations)
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnWoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'idn_wood_fiber\' as tablename, cartodb_id, the_geom_webmercator, name, group_comp as group, country, source as provider, last_updat as last_update, area_ha, type, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, group, country, provider, type, last_update, area_ha, analysis',
      analysis: true
    }

  });

  return IdnWoodFiberPlantationsLayer;

});
