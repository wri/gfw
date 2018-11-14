import request from 'utils/request';

const QUERY =
  "WITH pc as (SELECT * from ptw_config_table where published = TRUE), pg as ( select grid_id, st_symdifference(st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5500, 'quad_segs=24')), st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5100, 'quad_segs=24'))) as the_geom_webmercator from ptw_grid_may2018_score_gt_0 where grid_id in (select grid_id from pc)), ptw AS (SELECT pc.cartodb_id, pc.grid_id, pc.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, pc.overlap_pa, pc.overlap_ifl, pc.description, 'ptw_grid_may2018_score_gt_0'::text AS tablename, 'ptw_top_10'::text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE AS analysis FROM ptw_config_table pc WHERE pc.published = TRUE) SELECT ptw.*, FALSE AS marker, pg.the_geom_webmercator, st_asgeojson(ST_transform(ST_Envelope(pg.the_geom_webmercator),4326)) bbox FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id UNION ALL SELECT ptw.*, TRUE AS marker, St_centroid(pg.the_geom_webmercator) AS the_geom_webmercator,st_asgeojson(ST_transform(ST_Envelope(pg.the_geom_webmercator), 4326)) bbox FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id";
const REQUEST_URL = `${process.env.CARTO_API}/sql?q=${QUERY}`;

export const getPTWProvider = () => request.get(REQUEST_URL);

export default {
  getPTWProvider
};
