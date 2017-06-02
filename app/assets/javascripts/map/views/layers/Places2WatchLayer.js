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
      sql: 'WITH pc as (SELECT * from ptw_config_table where published = TRUE), pg as ( select grid_id, st_symdifference(st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5500, \'quad_segs=24\')), st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5100, \'quad_segs=24\'))) as the_geom_webmercator from ptw_grid_score_gt_0 where grid_id in (select grid_id from pc)), ptw AS (SELECT pt.cartodb_id, pt.grid_id, pt.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, pc.overlap_pa, pc.overlap_ifl, pc.description, \'ptw_grid_score_gt_0\'::text AS tablename, \'ptw_top_10\'::text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE AS analysis FROM ptw_config_table pc INNER JOIN ptw_top_10 pt ON pc.grid_id = pt.grid_id WHERE pc.published = TRUE) SELECT ptw.*, FALSE AS marker, pg.the_geom_webmercator FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id UNION ALL SELECT ptw.*, TRUE AS marker, St_centroid(pg.the_geom_webmercator) AS the_geom_webmercator FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, link, image, image_source, analysis, description, overlap_pa, overlap_ifl, actions, analize, readmore',
      analysis: false,
      cartocss: Places2WatchCartocss,
      actions: 'analize, readmore'
    }
  });

  return Places2WatchLayer;

});
