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
      sql: 'with r as (SELECT cartodb_id, the_geom_webmercator,  grid_id  FROM ptw_grid_score_gt_0 order by cartodb_id asc ), f as (select r.*, emissions_sum, glad_count, iso, score, \'{tableName}\'::text as tablename, \'{tableName}\'::text AS layer, {analysis} AS analysis from r inner join {tableName} s on r.grid_id=s.grid_id) (select cartodb_id, st_centroid(the_geom_webmercator) as the_geom_webmercator,  grid_id, emissions_sum,glad_count, iso, score, \'{tableName}\'::text as ptw_top_10, \'{tableName}\'::text AS layer, {analysis} AS analysis, false as dtype from f Union all select f.*, true as dtype from f order by grid_id asc)',
      infowindow: true,
      interactivity: 'cartodb_id, emissions_sum, score, glad_count, analysis',
      analysis: false,
      cartocss: Places2WatchCartocss
    }
  });

  return Places2WatchLayer;

});
