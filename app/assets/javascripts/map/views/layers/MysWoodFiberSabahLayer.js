/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MysWoodFiberSabahLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator,  name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}",
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, analysis',
      analysis: true
    }

  });

  return MysWoodFiberSabahLayer;

});