import ForestCover from './layers/forestCover';
import ForestCover2010 from './layers/forestCover2010';
import ForestGain from './layers/forestGain';
import IntactForest from './layers/intactForest';
import Loss from './layers/loss';
import PlantationsByType from './layers/plantationsByType';
import PlantationsBySpecies from './layers/plantationsBySpecies';
import Glad from './layers/glad';
import Viirs from './layers/viirs';
import Mining from './layers/mining';
import ProtectedAreas from './layers/protectedAreas';

const layersMap = {
  forest2000: ForestCover,
  forest2010: ForestCover2010,
  forestGain: ForestGain,
  ifl_2013_deg: IntactForest,
  loss: Loss,
  plantations_by_type: PlantationsByType,
  plantations_by_species: PlantationsBySpecies,
  umd_as_it_happens: Glad,
  viirs_fires_alerts: Viirs,
  mining: Mining,
  protected_areasCDB: ProtectedAreas
};

export default layersMap;
