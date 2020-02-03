/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var NamResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'nam_resource_rights\' as tablename, cartodb_id, the_geom_webmercator, name, round(area_ha::float) as area_ha,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      analysis: true
    }

  });

  return NamResourceRightsLayer;

});