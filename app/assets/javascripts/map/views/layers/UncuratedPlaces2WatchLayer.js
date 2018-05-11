/**
 * Places to watch layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/UncuratedPlaces2Watch.cartocss'
], function(CartoDBLayerClass, Uncurated2WatchCartocss) {

  'use strict';

  var UncuratedPlaces2WatchLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'WITH r AS ( SELECT cartodb_id, the_geom_webmercator, grid_id FROM ptw_grid_may2018_score_gt_0 ORDER BY cartodb_id ASC ), fc AS ( SELECT pt.cartodb_id, pt.glad_count, pt.the_geom_webmercator, pt.grid_id, pt.datestamp, pt.score FROM ptw_top_10 pt), f AS ( SELECT r.*, fc.glad_count, to_char(fc.datestamp, \'MM/DD/YYYY\') as datestamp, fc.score, \'ptw_grid_may2018_score_gt_0\' :: text AS tablename, \'ptw_top_10\' :: text AS LAYER, FALSE AS actions, FALSE AS analize, FALSE AS readmore, FALSE AS analysis FROM r inner join fc ON r.grid_id = fc.grid_id ) (SELECT cartodb_id, St_centroid(the_geom_webmercator) AS the_geom_webmercator, grid_id, glad_count, datestamp, score as ptw_score, \'ptw_grid_may2018_score_gt_0\' :: text AS tablename, \'ptw_top_10\' :: text AS LAYER, FALSE AS actions, FALSE AS analize, FALSE AS readmore, FALSE AS analysis, FALSE AS dtype FROM f UNION ALL SELECT f.*, TRUE AS dtype FROM f ORDER  BY grid_id ASC)',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, glad_count, analysis, actions, analize, readmore, grid_id, datestamp, ptw_score',
      analysis: false,
      cartocss: Uncurated2WatchCartocss,
      actions: 'analize, readmore'
    }
  });

  return UncuratedPlaces2WatchLayer;

});
