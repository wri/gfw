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
      sql: 'SELECT cartodb_id,  \'{tableName}\' as tablename, the_geom_webmercator, name, class, start_date, end_date, jurisdicti, company1 AS company, round((area_ha)::numeric,2) AS area_ha, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, end_date, name, class, jurisdicti, company, area_ha, start_date, analysis',
      analysis: true
    }
  });

  return CanLoggingLayer;

});

