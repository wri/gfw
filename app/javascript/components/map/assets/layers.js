import Forest2000 from './layers/forest2000';
import Forest2010 from './layers/forest2010';
import ForestGain from './layers/forestGain';
import IntactForest from './layers/intact-forest';
import Loss from './layers/loss';
import plantationsByType from './layers/plantationsByType';

const layersMap = {
  forest2000: Forest2000,
  forest2010: Forest2010,
  forestGain: ForestGain,
  ifl_2013_deg: IntactForest,
  loss: Loss,
  plantations_by_type: plantationsByType
};

export default layersMap;
