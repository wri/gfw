/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CogLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cog_logging\' as tablename, cartodb_id, the_geom_webmercator, ste_att_en as company, round(hectares::float) as area_ha, nom_conc_f as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return CogLoggingLayer;

});