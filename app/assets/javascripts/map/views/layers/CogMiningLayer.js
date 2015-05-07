/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CogMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cog_mining\' as tablename, cartodb_id, the_geom_webmercator, nom_societ as company, sup_off_2 area_ha, nom_permit as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
    


  });

  return CogMiningLayer;

});