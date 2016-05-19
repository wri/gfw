/**
 * The ProtectedAreasCDB layer module.
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/Pa.cartocss',
], function(CartoDBLayerClass,PaCartocss) {

  'use strict';

  var ProtectedAreasCDBLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, the_geom,iucn_cat, desig_eng, iso3 as country, name, wdpaid as id, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'desig_eng, country, name, id, analysis, iucn_cat',
      analysis: true,
      cartocss: PaCartocss,

    },

  });

  return ProtectedAreasCDBLayer;

});
