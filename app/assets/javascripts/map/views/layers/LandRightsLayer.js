/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass'
], function(CartoDBLayerClass) {

  'use strict';

  var LandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, name, country, legal_term, legal_reco as legal_recognition, ROUND(area_ha::text::float) AS area_ha, \'{tableName}\' AS tablename,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, name, country, legal_term, legal_recognition, area_ha, analysis',
      analysis: true
    }

  });

  return LandRightsLayer;

});
