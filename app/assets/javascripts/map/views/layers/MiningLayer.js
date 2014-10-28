/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, \'mining\' as tablename, the_geom_webmercator, type, status,company, country, area_ha, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName} WHERE company <>\'(70085559) FABIO LEON CORDOBA RUA\' AND (company is not null OR country<>\'Colombia\')',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, type, status,company, country, area_ha, analysis',
      analysis: true
    }


  });

  return MiningLayer;

});
