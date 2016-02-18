/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var PerNatPALayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, anp_nomb as name, anp_arle as area_ha, anp_cate as category, anp_fecrea as date_created, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, date_created, area_ha, analysis',
      analysis: true
    }

  });

  return PerNatPALayer;

});