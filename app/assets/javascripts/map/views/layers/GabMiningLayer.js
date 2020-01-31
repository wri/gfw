/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GabMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'gab_mining\' as tablename, cartodb_id, the_geom_webmercator, titulaire as company, superfic_1 as area_ha, pa_num as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
    


  });

  return GabMiningLayer;

});