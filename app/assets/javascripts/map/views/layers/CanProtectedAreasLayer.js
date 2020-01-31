/**
 * The PA layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/canPA.cartocss',
], function(CartoDBLayerClass, CanPACartocss) {

  'use strict';

  var CanPALayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator,status_e as status, protdate as date, provider, iucn_cat category, loc_e as location, name_e as name, mgmt_e management, round(o_area::float) as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, date, name, category, provider, location, status, management, area_ha, analysis',
      analysis: true,
      cartocss: CanPACartocss
    }
  });

  return CanPALayer;

});
