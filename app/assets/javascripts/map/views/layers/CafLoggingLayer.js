/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CafLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'caf_logging\' as tablename, cartodb_id, the_geom_webmercator, pea_nom as company, round(surface_ha::float) as area_ha, nom_exploi as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return CafLoggingLayer;

});