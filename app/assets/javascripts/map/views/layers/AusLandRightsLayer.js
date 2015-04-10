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
      sql: 'SELECT \'aus_land_rights\' as tablename, cartodb_id, the_geom_webmercator, name, legal_term as national_legal_term, reco as legal_recognition, status_dat as date_create,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, name, national_legal_term, legal_recognition, date_create, analysis',
      analysis: false
    }

  });

  return AusLandRightsLayer;

});