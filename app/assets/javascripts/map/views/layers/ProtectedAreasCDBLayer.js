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
      sql: 'SELECT the_geom_webmercator, cartodb_id, the_geom, desig, desig_eng, desig_type, gis_area, iso3, orig_name, parent_iso, rep_area, shape_area, shape_leng, status_yr, wdpaid, wdpa_pid, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}',
      infowindow: true,
      interactivity: 'orig_name',
      analysis: true
    },

  });

  return ProtectedAreasCDBLayer;

});
