/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GabLoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'gab_logging\' as tablename, cartodb_id, the_geom_webmercator, nom_ste_s as company, round(sup_adm::float) as area_ha,nom_ste as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }
  });

  return GabLoggingLayer;

});