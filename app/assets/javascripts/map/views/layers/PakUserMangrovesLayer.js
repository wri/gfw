/**
 * The Pakistan User Data Mangrove layer module.
 *
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var PakUserMangrovesLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, name, area_ha, plt_year, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, plt_year, area_ha, analysis',
      analysis: true
    }

  });

  return PakUserMangrovesLayer;

});