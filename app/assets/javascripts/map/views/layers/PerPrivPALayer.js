/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var PerPrivPALayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, anpc_nomb as name, anpc_titu as owner, anpc_area as area_ha, anpc_felec as date_created, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, owner, date_created, area_ha, analysis',
      analysis: true
    }

  });

  return PerPrivPALayer;

});