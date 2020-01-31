/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/concesiones_peru.cartocss'
], function(CartoDBLayerClass,concesiones_forestalesCartoCSS) {

  'use strict';
  var concesiones_forestales = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, titular as title_holder, round(area_ha::numeric) area_ha, modalid as type, contrato contract, dpto department, estado as supervision, provincia province, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS name FROM {tableName}',
      analysis: true,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, title_holder, area_ha, type, contract, department, province, supervision, analysis',
      cartocss: concesiones_forestalesCartoCSS
    }

  });

  return concesiones_forestales;

});
