import axios from 'axios';

const APIURL = 'http://wri-01.cartodb.com/api/v2/sql';

const APIURLS = {
  'layerSpec': `?q=SELECT cartodb_id AS id, slug, title, title_color, analyzable, subtitle, sublayer, table_name, source, source_json, category_color, category_slug, is_forest_clearing, category_name, external, iso, zmin, zmax, mindate, maxdate, ST_XMAX(the_geom) AS xmax, ST_XMIN(the_geom) AS xmin, ST_YMAX(the_geom) AS ymax, ST_YMIN(the_geom) AS ymin, tileurl, does_wrapper, user_data, parent_layer, true AS visible FROM {dataset} WHERE display = 'true' ORDER BY displaylayer, title ASC`
};

export const getLayerSpec = () => {
  const url = `${APIURL}${APIURLS.layerSpec}`
    .replace('{dataset}', window.gfw.layer_spec);
  return axios.get(url);
};
