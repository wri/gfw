/**
 * The Plantations layer module.
 *
 * @return PlantationsLayerByType class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/LoggingRoads.cartocss'

], function(CartoDBLayerClass, LoggingRoadsCartocss) {

  'use strict';

  var LoggingRoadsLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT CASE WHEN (start_date ~ '^([0-9]+[.]?[0-9]*|[.][0-9]+)$') is True THEN start_date::int WHEN start_date = '20014' THEN '2014'::int WHEN start_date = '22014' THEN '2014'::int WHEN start_date = '20136' THEN '2013'::int WHEN substring(start_date from 1 for 7) = 'before ' and  (substring(start_date from 8 for 4) ~ '^([0-9]+[.]?[0-9]*|[.][0-9]+)$') THEN substring(start_date from 8 for 4)::int WHEN substring(start_date from 1 for 6) = 'after ' THEN substring(start_date from 7 for 4)::int ELSE NULL END as time,\'{tableName}\' AS tablename, \'{tableName}\' AS layer, * FROM {tableName} WHERE access like 'forestry'",
      cartocss: LoggingRoadsCartocss,
      infowindow: false,
      analysis: false,

    },

  });

  return LoggingRoadsLayer;

});