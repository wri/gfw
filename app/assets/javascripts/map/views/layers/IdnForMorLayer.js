/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnForMorLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'idn_logging\' as tablename, cartodb_id, the_geom_webmercator, mor_rev6, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: false,
      interactivity: 'cartodb_id, tablename',
      analysis: false
    }
  });

  return IdnForMorLayer;

});