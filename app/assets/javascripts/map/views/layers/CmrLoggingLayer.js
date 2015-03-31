/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CmrLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cmr_logging\' as tablename, cartodb_id, the_geom_webmercator, attributai AS company, round(sup_defini::float) AS area_ha, toponyme AS name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: false
    }
  });

  return CmrLoggingLayer;

});