import CartoDB from './abstract/cartoDB';
import IntactForestCartoCSS from '../cartocss/intact-forest.cartocss';

const OPTIONS = {
  sql:
    "SELECT *, '{tableName}' as layer, '{tableName}' as name FROM {tableName}",
  cartocss: IntactForestCartoCSS
};

class IntactForest extends CartoDB {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...OPTIONS, ...options };
  }
}

export default IntactForest;
