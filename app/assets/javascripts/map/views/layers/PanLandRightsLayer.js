/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var PanLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'pan_land_rights\' as tablename, cartodb_id, the_geom_webmercator, name, leg_rec as legal_recognition, round(area_ha::float) as area_ha,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, legal_recognition, area_ha, analysis',
      analysis: true
    }

  });

  return PanLandRightsLayer;

});