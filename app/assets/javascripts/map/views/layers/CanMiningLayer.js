/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_mining\' as tablename, cartodb_id, the_geom_webmercator, round(area_ha::float) as area_ha, name, company, permit as permit_num, type, province, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, company, permit_num, type, province, analysis',
      analysis: true
    }



  });

  return CanMiningLayer;

});
