/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LbrResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'lbr_resource_rights\' as tablename, cartodb_id, the_geom_webmercator, leg_rec as legal_recognition,nat_leg_te as national_legal_term, name, round(area_ha::float) as area_ha,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name,legal_recognition, national_legal_term, area_ha, analysis',
      analysis: true
    }

  });

  return LbrResourceRightsLayer;

});