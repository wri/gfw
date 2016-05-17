/**
 * Places to watch layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/Places2Watch.cartocss'
], function(CartoDBLayerClass, Places2WatchCartocss) {

  'use strict';

  var Places2WatchLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, ntile, the_geom_webmercator, round(area_ha::float) as area_ha, slope, alerts_last_month, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, area_ha, slope, alerts_last_month, analysis',
      analysis: true,
      cartocss: Places2WatchCartocss
    }
    


  });

  return Places2WatchLayer;

});