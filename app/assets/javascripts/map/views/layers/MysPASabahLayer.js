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

  var MysPASabahLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, type, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, type, analysis',
      analysis: true
    }
  });

  return MysPASabahLayer;

});


