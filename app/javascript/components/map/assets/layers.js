import Forest2000 from './layers/forest2000';
import Forest2010 from './layers/forest2010';
import ForestGain from './layers/forestGain';
import IntactForest from './layers/intact-forest';
import Loss from './layers/loss';
import plantationsByType from './layers/plantationsByType';
import PlantationsBySpecies from './layers/plantations-by-species';
import Glad from './layers/glad';
import Viirs from './layers/viirs';
import Mining from './layers/mining';
import ProtectedAreas from './layers/protected-areas';

const layersMap = {
  forest2000: Forest2000,
  forest2010: Forest2010,
  forestGain: ForestGain,
  ifl_2013_deg: IntactForest,
  loss: Loss,
  plantations_by_type: plantationsByType,
  plantations_by_species: PlantationsBySpecies,
  umd_as_it_happens: Glad,
  viirs_fires_alerts: Viirs,
  mining: Mining,
  protected_areasCDB: ProtectedAreas
};

export default layersMap;
