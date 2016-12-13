/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/lbr_forest.cartocss'
], function(CartoDBLayerClass,lbrForestCartocss) {

  'use strict';

  var LbrLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, round(area_ha::float) as area_ha, name, county, status, last_updat, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, county, status, last_updat, area_ha, analysis',
      cartocss: lbrForestCartocss,
      analysis: true
    }
  });

  return LbrLoggingLayer;

});