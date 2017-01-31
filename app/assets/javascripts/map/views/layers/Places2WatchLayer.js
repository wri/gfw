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
      sql: 'with r as (SELECT cartodb_id, the_geom_webmercator, st_asgeojson(the_geom_webmercator), grid_id FROM ptw_grid_score_gt_0 order by cartodb_id asc ) select r.*, emissions_sum,glad_count, iso, score,\'{tableName}\' as tablename, \'{tableName}\' AS layer,{analysis} AS analysis from r inner join {tableName} s on r.grid_id=s.grid_id',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, emissions_sum, score, glad_count, analysis',
      analysis: true,
      cartocss: Places2WatchCartocss
    }



  });

  return Places2WatchLayer;

});
