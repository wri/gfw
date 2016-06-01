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
      sql: 'SELECT \'{tableName}\' as tablename, cartodb_id, ntile, ST_ConvexHull(the_geom_webmercator) the_geom_webmercator, slope_semester::numeric, alerts_last_semester::text,  \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName} where ntile=5 and alerts_last_semester is not null',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, slope_semester, alerts_last_semester, analysis',
      analysis: true,
      cartocss: Places2WatchCartocss
    }
    


  });

  return Places2WatchLayer;

});