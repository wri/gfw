/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CodLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cod_logging\' as tablename, cartodb_id, the_geom_webmercator, nom_ste_a as company, round(sup_adm_ga::float) as area_ha, num_ga as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: false
    }
  });

  return CodLoggingLayer;

});