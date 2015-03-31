/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanCoalMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_coal\' as tablename, cartodb_id, the_geom_webmercator, area_eq_ha as area_ha, lease_name as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, analysis',
      analysis: false
    }
    


  });

  return CanCoalMiningLayer;

});