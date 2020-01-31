/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GnqLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'gnq_logging\' as tablename, cartodb_id, the_geom_webmercator, empresa as company, sup_sig_ha as area_ha, localizaci as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return GnqLoggingLayer;

});