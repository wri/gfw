/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CmrMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cmr_mining\' as tablename, cartodb_id, the_geom_webmercator, nom_permis as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, analysis',
      analysis: true
    }
    


  });

  return CmrMiningLayer;

});