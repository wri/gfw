/**
 * The WWF layer module for use on canvas.
 *
 * @return WWFLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass'
], function(CartoDBLayerClass) {

  'use strict';

  var LbrDevExLLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, title as name, hectares::numeric as area_ha, datesign,  source,  resources, contractsi, duration, contractst, agency, pcompcount, pcompany, company, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, datesign,  source,  resources, contractsi, duration, contractst, agency, pcompcount, pcompany, company, area_ha, analysis',
      analysis: true
    }

  });

  return LbrDevExLLayer;

});