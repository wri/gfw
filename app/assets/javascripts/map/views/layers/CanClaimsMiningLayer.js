/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanClaimsMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_claims\' as tablename, cartodb_id, the_geom_webmercator, area as area_ha, claim_name as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, analysis',
      analysis: true
    }
    


  });

  return CanClaimsMiningLayer;

});