import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  layerSpec:
    "SELECT cartodb_id AS id, slug, title, title_color, analyzable, subtitle, sublayer, table_name, source, source_json, category_color, category_slug, is_forest_clearing, category_name, external, iso, zmin, zmax, mindate, maxdate, ST_XMAX(the_geom) AS xmax, ST_XMIN(the_geom) AS xmin, ST_YMAX(the_geom) AS ymax, ST_YMIN(the_geom) AS ymin, tileurl, does_wrapper, user_data, parent_layer, true AS visible FROM {dataset} WHERE display = 'true' ORDER BY displaylayer, title ASC"
};

export const fetchLayerSpec = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.layerSpec}`.replace(
    '{dataset}',
    window.gfw.layer_spec
  );
  return axios.get(url);
};
