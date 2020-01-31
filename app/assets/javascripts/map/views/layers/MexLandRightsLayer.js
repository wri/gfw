/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mexLandRights.cartocss'
], function(CartoDBLayerClass,mexLandRights) {

  'use strict';

  var MexLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom, the_geom_webmercator, nombre as name, tipo as type,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, type, analysis',
      analysis: true,
      cartocss: mexLandRights
    }

  });

  return MexLandRightsLayer;

});

