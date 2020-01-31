/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var AusLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, name, legal_term as national_legal_term, reco as legal_recognition, status_dat as date_create, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, layer, national_legal_term, legal_recognition, date_create, analysis',
      analysis: true
    }

  });

  return AusLandRightsLayer;

});