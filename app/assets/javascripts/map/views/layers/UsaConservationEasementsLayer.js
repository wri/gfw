/**
 * The ProtectedAreasCDB layer module.
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var UsaConservationEasementsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, \'{tableName}\' as tablename, the_geom_webmercator, sitename as name, round(gis_acres::float) as gis_acres, round(rep_acres::float) as rep_acres, state, purpose, pubaccess, duration, dataagg, datapvdr, esmthldr, eholdtyp, \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: ' cartodb_id, tablename, name, gis_acres, rep_acres, state, purpose, pubaccess, duration, dataagg, datapvdr, esmthldr, eholdtyp, analysis',
      analysis: true
    },

  });

  return UsaConservationEasementsLayer;

});