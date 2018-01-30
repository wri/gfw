import Overlay from './overlay';
import CartoCSS from '../../cartocss/style.cartocss';

const OPTIONS = {
  user_name: 'wri-01',
  type: 'cartodb',
  sql: null,
  cartocss: CartoCSS,
  interactivity: 'cartodb_id, name',
  infowindow: false,
  cartodb_logo: false,
  raster: false,
  analysis: false,
  actions: {},
  queryTemplate:
    "SELECT cartodb_id||':' ||'{tableName}' as cartodb_id, the_geom_webmercator,'{tableName}' AS layer, {analysis} AS analysis, name FROM {tableName}" // eslint-disable-line
};

class CartoDB extends Overlay {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...this.options, ...options };
  }

  getLayer() {
    const cartodbOptions = {
      type: this.options.type,
      cartodb_logo: this.options.cartodb_logo,
      user_name: this.options.user_name,
      sublayers: [
        {
          sql: this._getQuery(),
          cartocss: this.options.cartocss,
          interactivity: this.options.interactivity,
          raster: this.options.raster,
          raster_band: this.options.raster_band
        }
      ]
    };

    return new Promise(resolve => {
      cartodb // eslint-disable-line
        .createLayer(this.map, cartodbOptions)
        .on('done', layer => {
          resolve(layer);
        });
    });
  }

  _getQuery() {
    const query = (this.options.sql || this.options.queryTemplate)
      .replace(/{tableName}/g, this.options.layerSpec.table_name)
      .replace('{analysis}', this.options.analysis);

    return query;
  }
}

export default CartoDB;
