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
      sql: 'with paths as (select (ST_Dump( st_makevalid(st_memunion(the_geom_webmercator)))).geom as the_geom_webmercator, (ST_Dump( st_makevalid(st_memunion(the_geom_webmercator)))).path as path from borneo_peru_roc_final_alerts_copy where six_score>25 order by path asc) select  \'{tableName}\' as tablename,  {analysis} AS analysis, st_convexhull(paths.the_geom_webmercator) as the_geom_webmercator,paths.path, sum (t.count_6months)as total_alerts, round(avg(six_score)::numeric,2) as avg_score, sum (t.count_6months)*avg(six_score) as final_score, min(t.cartodb_id) as cartodb_id from paths, borneo_peru_roc_final_alerts_copy t where st_contains(paths.the_geom_webmercator, t.the_geom_webmercator) group by paths.the_geom_webmercator,paths.path',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, total_alerts, avg_score, analysis',
      analysis: true,
      cartocss: Places2WatchCartocss
    }
    


  });

  return Places2WatchLayer;

});