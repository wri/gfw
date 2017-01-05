/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/Lbr_community.cartocss',
], function(CartoDBLayerClass,lbrCommCartocss) {

  'use strict';

  var LbrResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'lbr_resource_rights\' as tablename, cartodb_id, the_geom_webmercator, last_updat, status, name, round(area_ha::numeric) as area_ha,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, status, last_updat, area_ha, analysis',
      cartocss: lbrCommCartocss,
      analysis: true
    }

  });

  return LbrResourceRightsLayer;

});