import CartoDB from './abstract/cartoDB';
import ProtectedAreasCartoCSS from '../cartocss/protected-areas.cartocss';

const OPTIONS = {
  sql:
    "SELECT the_geom_webmercator, the_geom,iucn_cat, desig_eng, iso3 as country, name, wdpaid as id, {analysis} AS analysis, '{tableName}' as layer FROM {tableName}",
  cartocss: ProtectedAreasCartoCSS,
  infowindow: true,
  interactivity: 'desig_eng, country, name, id, analysis, iucn_cat'
};

class ProtectedAreas extends CartoDB {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...this.options, ...options };
  }
}

export default ProtectedAreas;
