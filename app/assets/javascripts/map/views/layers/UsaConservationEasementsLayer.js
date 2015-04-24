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
      sql: 'SELECT the_geom_webmercator, sitename as name, round(gis_acres::float) as gis_acres, round(rep_acres::float) as rep_acres, state, purpose, pubaccess, duration, dataagg, datapvdr, esmthldr, eholdtyp, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: ' name, gis_acres, rep_acres, state, purpose, pubaccess, duration, dataagg, datapvdr, esmthldr, eholdtyp, analysis',
      analysis: false
    },

  });

  return UsaConservationEasementsLayer;

});