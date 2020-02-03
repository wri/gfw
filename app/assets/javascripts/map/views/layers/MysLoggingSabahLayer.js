/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MysLoggingSabahLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, fmu_number as name, licensee, volume_m3, license_no, timber_src, certif, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}" ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, licensee, volume_m3, certif, license_no, timber_src, analysis',
      analysis: true
    }
  });

  return MysLoggingSabahLayer;

});