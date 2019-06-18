import request from 'utils/request';

const QUERY =
  "WITH mb AS ( WITH pc AS ( SELECT * FROM ptw_config_table WHERE published = TRUE), pg AS ( SELECT grid_id, the_geom_webmercator FROM ptw_grid_may2018_score_gt_0 WHERE grid_id IN (SELECT grid_id FROM pc)), ptw AS ( SELECT pc.cartodb_id, pc.grid_id, pc.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, pc.description, 'ptw_grid_may2018_score_gt_0' :: text AS tablename FROM ptw_config_table pc WHERE pc.published = TRUE) SELECT ptw.*, ST_buffer(St_centroid(pg.the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(pg.the_geom_webmercator) AS point, St_asgeojson(St_transform(St_envelope(pg.the_geom_webmercator), 4326) ) bbox, 'mongabay' :: text AS TYPE FROM ptw inner join pg ON ptw.grid_id = pg.grid_id) SELECT * FROM mb UNION ALL SELECT cartodb_id, grid_id, glad_count, description, name, NULL AS LINK, NULL AS image, NULL AS image_source, NULL AS text, ST_buffer(St_centroid(the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(the_geom_webmercator) AS point, St_asgeojson(St_transform(St_envelope(the_geom_webmercator), 4326)) bbox, 'palm' :: text AS TYPE FROM palm_ptw_top_10 UNION ALL SELECT cartodb_id, grid_id, glad_count, description, name, NULL AS LINK, NULL AS image, NULL AS image_source, NULL AS text, ST_buffer(St_centroid(the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(the_geom_webmercator) AS point, St_asgeojson(St_transform(St_envelope(the_geom_webmercator), 4326)) bbox, 'soy' :: text AS TYPE FROM soy_ptw_top_10";
const REQUEST_URL = `${process.env.CARTO_API}/sql?q=${QUERY}`;

export const getPTWProvider = () => request.get(REQUEST_URL);

export default {
  getPTWProvider
};
