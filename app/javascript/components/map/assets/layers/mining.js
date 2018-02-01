import CartoDB from './abstract/cartoDB';

const OPTIONS = {
  sql:
    "SELECT cartodb_id, 'mining' as tablename, the_geom_webmercator, status, company, country, round(area_ha::float) as area_ha, name, permit as permit_num, mineral, type, province, '{tableName}' AS layer, {analysis} AS analysis FROM {tableName}",
  infowindow: true,
  interactivity:
    'cartodb_id, tablename, name, status, company, country, permit_num, mineral, type, province, area_ha, analysis'
};

class Mining extends CartoDB {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...this.options, ...options };
  }
}

export default Mining;
