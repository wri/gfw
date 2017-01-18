/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var SenUserProtectedAreaLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, area_ha, date_crea, iucn_cat, legal_des, name, source , \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}" ,
      infowindow: true,
      interactivity: 'cartodb_id, area_ha, date_crea, iucn_cat, legal_des, name, source, analysis',
      analysis: true
    }
    


  });

  return SenUserProtectedAreaLayer;

});
