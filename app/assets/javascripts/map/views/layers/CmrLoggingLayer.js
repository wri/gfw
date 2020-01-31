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
      sql: 'SELECT \'cmr_logging\' as tablename, cartodb_id, the_geom_webmercator, attributai as company, sup_provis as area_ha, toponyme as name, \'{tableName}\' as layer, {analysis} as analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return CmrLoggingLayer;

});