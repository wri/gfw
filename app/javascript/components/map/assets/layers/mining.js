import CartoDB from './abstract/cartoDB';

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
    "SELECT cartodb_id, 'mining' as tablename, the_geom_webmercator, status, company, country, round(area_ha::float) as area_ha, name, permit as permit_num, mineral, type, province, '{tableName}' AS layer, {analysis} AS analysis FROM {tableName}",
  infowindow: true,
  interactivity:
    'cartodb_id, tablename, name, status, company, country, permit_num, mineral, type, province, area_ha, analysis'
};

class Mining extends CartoDB {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }
}

export default Mining;
