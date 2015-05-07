/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'idn_logging\' as tablename, cartodb_id, the_geom_webmercator, country, round(area_ha::float) as area_ha, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      analysis: true
    }
  });

  return IdnLoggingLayer;

});