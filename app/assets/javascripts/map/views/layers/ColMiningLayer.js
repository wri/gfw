/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ColMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'col_mining\' as tablename, cartodb_id, the_geom_webmercator, type, company, status, round(area_ha::float) as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, company, status, type, area_ha, analysis',
      analysis: true
    }
    


  });

  return ColMiningLayer;

});