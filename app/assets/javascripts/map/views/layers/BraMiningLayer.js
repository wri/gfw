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

  var BraMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, round(area_ha::float) as area_ha, nome as name, ano as year, fase as type, subs as substance, status, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,  area_ha, year, type, substance, status, analysis',
      analysis: true,
      cartocss: mining_by_typeCartocss
    }
    


  });

  return BraMiningLayer;

});