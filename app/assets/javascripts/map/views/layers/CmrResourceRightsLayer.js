/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CmrResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cmr_resource_rights\' as tablename, cartodb_id, the_geom_webmercator, attributai as name, round(superficie::float) as area_ha,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      analysis: true
    }

  });

  return CmrResourceRightsLayer;

});