/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mining_by_type.cartocss'
], function(CartoDBLayerClass, mining_by_typeCartocss) {

  'use strict';

  var PerMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, round(hectareas::float) as area_ha, nombre as name, titularref as company, fec_form::text as date_create, status, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, company, date_create, status, analysis',
      analysis: true,
      cartocss: mining_by_typeCartocss
    }
    


  });

  return PerMiningLayer;

});