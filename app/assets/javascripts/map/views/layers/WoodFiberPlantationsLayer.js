/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var WoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'fiber\' as tablename, cartodb_id, source as provider, the_geom_webmercator,name, country, type, last_updat as last_update, group_comp as group, area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, group, country, provider, type, last_update, area_ha, analysis',
      analysis: true
    }

  });

  return WoodFiberPlantationsLayer;

});
