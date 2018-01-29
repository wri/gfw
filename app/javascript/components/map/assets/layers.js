import Forest2000 from './layers/forest2000';
import IntactForest from './layers/intact-forest';
import Loss from './layers/loss';

const layersMap = {
  forest2000: Forest2000,
  ifl_2013_deg: IntactForest,
  loss: Loss
};

export default layersMap;
