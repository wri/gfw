/**
 * The PA layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mysPA.cartocss',
], function(CartoDBLayerClass, MysPACartocss) {

  'use strict';

  var MysPALayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, category, status, gaz_eff_da as date_create, round(area_ha::float) as area_ha, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, status, category, area_ha, date_create, analysis',
      analysis: true,
      cartocss: MysPACartocss
    }
  });

  return MysPALayer;

});
