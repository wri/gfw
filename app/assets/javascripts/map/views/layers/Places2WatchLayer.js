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
      sql: 'WITH ptw AS ( SELECT pt.cartodb_id, pt.grid_id, pt.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, pc.overlap_pa, pc.overlap_ifl, pc.description, \'ptw_grid_score_gt_0\'::text AS tablename, \'ptw_top_10\'::text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE AS analysis FROM ptw_config_table pc INNER JOIN ptw_top_10 pt ON pc.grid_id = pt.grid_id WHERE pc.published = TRUE) SELECT ptw.*, FALSE AS marker, ST_SymDifference(ST_Buffer(st_centroid(pg.the_geom_webmercator), 5100, \'quad_segs=24\'), ST_Buffer(st_centroid(pg.the_geom_webmercator), 5300, \'quad_segs=24\')) AS the_geom_webmercator  FROM ptw INNER JOIN ptw_grid_score_gt_0 pg ON ptw.grid_id = pg.grid_id UNION ALL SELECT ptw.*, TRUE AS marker, St_centroid(pg.the_geom_webmercator) AS the_geom_webmercator FROM ptw INNER JOIN ptw_grid_score_gt_0 pg ON ptw.grid_id = pg.grid_id',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, link, image, image_source, analysis, description, overlap_pa, overlap_ifl, actions, analize, readmore',
      analysis: false,
      cartocss: Places2WatchCartocss,
      actions: 'analize, readmore'
    }
  });

  return Places2WatchLayer;

});
