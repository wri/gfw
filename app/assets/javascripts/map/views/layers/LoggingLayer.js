/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, company, country, permit_num, nat_origin, area_ha, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'name, company, country, permit_num, nat_origin, area_ha, analysis',
      analysis: true
    }

  });

  return LoggingLayer;

});
