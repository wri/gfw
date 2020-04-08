import { cartoRequest } from 'utils/request';

const QUERY =
  "with s AS (SELECT * FROM ptw_soy_grid), stt AS (SELECT * FROM soy_ptw_top_10), p AS (SELECT * FROM ptw_palm_grid), ptt AS (SELECT * FROM palm_ptw_top_10), pc AS (SELECT * FROM ptw_config_table WHERE published = TRUE), pg AS ( SELECT grid_id, the_geom_webmercator FROM ptw_grid_may2018_score_gt_0 WHERE grid_id IN (SELECT grid_id FROM pc)), ptw AS ( SELECT pc.cartodb_id, pc.grid_id, pc.description, pc.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, 'ptw_grid_may2018_score_gt_0' :: text AS tablename FROM ptw_config_table pc WHERE pc.published = TRUE), mb AS (SELECT ptw.*, ST_buffer(St_centroid(pg.the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(pg.the_geom_webmercator) AS point, St_asgeojson(St_transform(St_envelope(pg.the_geom_webmercator), 4326) ) bbox, 'mongabay' :: text AS TYPE FROM ptw inner join pg ON ptw.grid_id = pg.grid_id), soy AS (SELECT s.cartodb_id, s.grid_id, stt.description, stt.glad_count, stt.name, NULL AS LINK, NULL AS image, NULL AS image_source, 'soy_ptw_top_10' :: text AS tablename,        ST_buffer(St_centroid(s.the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(s.the_geom_webmercator) AS point,  St_asgeojson(St_transform(St_envelope(s.the_geom_webmercator), 4326)) AS bbox, 'soy' :: text AS TYPE FROM s inner join stt ON s.grid_id = stt.grid_id), palm AS (SELECT p.cartodb_id, p.grid_id, ptt.description, ptt.glad_count, ptt.name, NULL AS LINK, NULL AS image, NULL AS image_source, 'palm_ptw_top_10' :: text AS tablename, ST_buffer(St_centroid(p.the_geom_webmercator), 5500, 'quad_segs=24') AS the_geom_webmercator, St_centroid(p.the_geom_webmercator) AS point, St_asgeojson(St_transform(St_envelope(p.the_geom_webmercator), 4326)) AS bbox, 'palm' :: text AS TYPE FROM p inner join ptt ON p.grid_id = ptt.grid_id) SELECT * FROM mb UNION ALL SELECT * FROM soy UNION ALL SELECT * FROM palm";
const REQUEST_URL = `/sql?q=${QUERY}`;

export const getPTWProvider = () => cartoRequest.get(REQUEST_URL);

export default {
  getPTWProvider
};
