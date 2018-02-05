import CartoDB from './abstract/cartoDB';
import PlantationsByTypeCartoCSS from '../cartocss/plantations-by-type.cartocss';

const OPTIONS = {
  user_name: 'wri-01',
  type: 'cartodb',
  cartodb_logo: false,
  raster: false,
  actions: {},
  queryTemplate:
    "SELECT cartodb_id||':' ||'{tableName}' as cartodb_id, the_geom_webmercator,'{tableName}' AS layer, {analysis} AS analysis, name FROM {tableName}", // eslint-disable-line
  sql:
    "SELECT the_geom_webmercator, cartodb_id, type_text, spec_org, spec_simp, percent, round(area_ha::numeric,1) as area_ha, '{tableName}' AS tablename, '{tableName}' AS layer, {analysis} AS analysis FROM {tableName}",
  cartocss: PlantationsByTypeCartoCSS,
  infowindow: true,
  interactivity:
    'cartodb_id, tablename, layer, analysis, type_text, spec_org, spec_simp, percent, area_ha',
  analysis: true
};

class PlantationsByType extends CartoDB {
  constructor(map, options) {
    super(map, options);
    this.options = { ...options, ...OPTIONS };
  }
}

export default PlantationsByType;
