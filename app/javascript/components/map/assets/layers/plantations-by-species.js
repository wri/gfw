import CartoDB from './abstract/cartoDB';
import PlantationsBySpeciesCartoCSS from '../cartocss/plantations-by-species.cartocss';

const OPTIONS = {
  sql:
    "SELECT the_geom_webmercator, cartodb_id, type_text, spec_org, spec_simp, round(area_ha::numeric,1) as area_ha, percent, '{tableName}' AS tablename, '{tableName}' AS layer, {analysis} AS analysis FROM {tableName}",
  cartocss: PlantationsBySpeciesCartoCSS,
  infowindow: true,
  interactivity:
    'cartodb_id, tablename, layer, analysis, type_text, spec_org, spec_simp, area_ha, percent',
  analysis: true
};

class PlantationsBySpecies extends CartoDB {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...OPTIONS, ...options };
  }
}

export default PlantationsBySpecies;
