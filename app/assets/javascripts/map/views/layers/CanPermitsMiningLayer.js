/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanPermitsMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_permits\' as tablename, cartodb_id, the_geom_webmercator, round(area_eq_ha::float) as area_ha, holder as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, analysis',
      analysis: false
    }
    


  });

  return CanPermitsMiningLayer;

});