/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CriLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cri_land_rights\' as tablename, cartodb_id, the_geom_webmercator, nombre as name, repre_lega as national_legal_term, legal_reco as legal_recognition, round(area::float) as area_ha, \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, legal_recognition, area_ha, analysis',
      analysis: true
    }

  });

  return CriLandRightsLayer;

});