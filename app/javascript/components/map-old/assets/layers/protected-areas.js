import CartoDB from './abstract/cartoDB';
import ProtectedAreasCartoCSS from '../cartocss/protected-areas.cartocss';

const OPTIONS = {
  user_name: 'wri-01',
  type: 'cartodb',
  cartodb_logo: false,
  raster: false,
  actions: {},
  queryTemplate:
    "SELECT cartodb_id||':' ||'{tableName}' as cartodb_id, the_geom_webmercator,'{tableName}' AS layer, {analysis} AS analysis, name FROM {tableName}", // eslint-disable-line
  analysis: true,
  sql:
    "SELECT the_geom_webmercator, the_geom,iucn_cat, desig_eng, iso3 as country, name, wdpaid as id, {analysis} AS analysis, '{tableName}' as layer FROM {tableName}",
  cartocss: ProtectedAreasCartoCSS,
  infowindow: true,
  interactivity: 'desig_eng, country, name, id, analysis, iucn_cat'
};

class ProtectedAreas extends CartoDB {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }
}

export default ProtectedAreas;
