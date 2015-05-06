/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_logging\' as tablename, cartodb_id, the_geom_webmercator, company, country, round(area_ha::float) as area_ha, name, source, type, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return CanLoggingLayer;

});