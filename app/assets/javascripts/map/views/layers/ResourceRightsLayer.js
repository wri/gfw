/**
 * The ResourceRights layer module.
 *
 * @return ResourceRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, name, country, round(area_ha::float) as area_ha, legal_term, legal_reco as legal_recognition,\'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer,country, name, area_ha, legal_term, legal_recognition, analysis',
      analysis: true
    }

  });

  return ResourceRightsLayer;

});
