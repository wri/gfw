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
      sql: 'SELECT cartodb_id, \'mining\' as tablename, the_geom_webmercator, status, company, country, round(area_ha::float) as area_ha, name, permit as permit_num, mineral, type, province, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName} ',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, status, company, country, permit_num, mineral, type, province, area_ha, analysis',
      analysis: true
    }


  });

  return MiningLayer;

});
