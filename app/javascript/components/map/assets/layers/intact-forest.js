import CartoDB from './abstract/cartoDB';
import IntactForestCartoCSS from '../cartocss/intact-forest.cartocss';

const OPTIONS = {
  user_name: 'wri-01',
  type: 'cartodb',
  cartodb_logo: false,
  raster: false,
  actions: {},
  queryTemplate:
    "SELECT cartodb_id||':' ||'{tableName}' as cartodb_id, the_geom_webmercator,'{tableName}' AS layer, {analysis} AS analysis, name FROM {tableName}", // eslint-disable-line
  analysis: true,
  infowindow: true,
  sql:
    "SELECT *, '{tableName}' as layer, '{tableName}' as name FROM {tableName}",
  cartocss: IntactForestCartoCSS
};

class IntactForest extends CartoDB {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }
}

export default IntactForest;
