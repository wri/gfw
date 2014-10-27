/**
 * The ProtectedAreasCDB layer module.
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ProtectedAreasCDBLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, the_geom, desig_eng, iso3 as country, name, wdpaid as id, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'desig_eng, country, name, id',
      analysis: true
    },

  });

  return ProtectedAreasCDBLayer;

});
