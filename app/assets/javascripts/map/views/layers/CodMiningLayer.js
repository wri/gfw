/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CodMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cod_mining\' as tablename, cartodb_id, the_geom_webmercator, parties as company, resource as name, sup_sig_ha as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, company, name, area_ha, analysis',
      analysis: true
    }
    


  });

  return CodMiningLayer;

});