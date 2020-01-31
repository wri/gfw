/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, name, nat_leg_te as national_legal_term, leg_rec as legal_recognition, round(area_ha::float) as area_ha, \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, national_legal_term, legal_recognition, area_ha, analysis',
      analysis: true
    }

  });

  return CanLandRightsLayer;

});