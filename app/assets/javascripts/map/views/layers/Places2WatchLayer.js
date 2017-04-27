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
      sql: 'WITH r AS ( SELECT cartodb_id, the_geom_webmercator, grid_id FROM ptw_grid_score_gt_0 ORDER  BY cartodb_id ASC ), fc AS ( SELECT pt.cartodb_id, pt.the_geom_webmercator, pt.grid_id, pc.name, pc.link, pc.image, pc.image_source, pc.overlap_pa, pc.overlap_ifl, pc.description FROM ptw_top_10 pt INNER JOIN ptw_config_table pc on pt.grid_id = pc.grid_id AND pc.published = true), f AS ( SELECT r.*, fc.name, fc.link, fc.image, fc.description,  fc.image_source, fc.overlap_pa, fc.overlap_ifl, \'ptw_grid_score_gt_0\' :: text AS tablename, \'ptw_top_10\' :: text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE AS analysis FROM r inner join fc ON r.grid_id = fc.grid_id ) (SELECT cartodb_id, St_centroid(the_geom_webmercator) AS the_geom_webmercator, grid_id, name, link, image, image_source, description, overlap_pa, overlap_ifl, \'ptw_grid_score_gt_0\' :: text AS tablename, \'ptw_top_10\' :: text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE  AS analysis, FALSE AS dtype FROM f UNION ALL SELECT f.*, TRUE AS dtype FROM   f ORDER  BY grid_id ASC)',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, link, image, image_source, analysis, description, overlap_pa, overlap_ifl, actions, analize, readmore',
      analysis: false,
      cartocss: Places2WatchCartocss,
      actions: 'analize, readmore'
    }
  });

  return Places2WatchLayer;

});
