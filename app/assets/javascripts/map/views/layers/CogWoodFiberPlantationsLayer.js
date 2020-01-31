/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CogWoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cog_wood_fiber\' as tablename, cartodb_id, the_geom_webmercator,  type, area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, type, area_ha, analysis',
      analysis: true
    }

  });

  return CogWoodFiberPlantationsLayer;

});