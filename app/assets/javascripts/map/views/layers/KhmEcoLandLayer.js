/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/khm_EcoLand.cartocss'
], function(CartoDBLayerClass, khm_EcoLandCartoCSS)
 {

  'use strict';

  var KhmEcoLandLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator,adjustment as adjustment_classification, developer as name, contractin as contracting_authority,contract_d as contract_duration, inv_intent, contract_0 as contract_date, \'{tableName}\' AS layer, {analysis} AS analysis, original_s as original_size_h FROM {tableName}" ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,adjustment_classification, contracting_authority, contract_duration, inv_intent, contract_date, original_size_h, analysis',
      cartocss: khm_EcoLandCartoCSS,
      analysis: true
    }


  });

  return KhmEcoLandLayer;

});