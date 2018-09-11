import ForestCover from './layers/forest-cover';
import ForestCover2010 from './layers/forest-cover-2010';
import ForestGain from './layers/forest-gain';
import IntactForest from './layers/intact-forest';
import Loss from './layers/loss';
import PlantationsByType from './layers/plantations-by-type';
import PlantationsBySpecies from './layers/plantations-by-species';
import Glad from './layers/glad';
import Viirs from './layers/viirs';
import Mining from './layers/mining';
import ProtectedAreas from './layers/protected-areas';

const layersMap = {
  forest2000: ForestCover,
  forest2010: ForestCover2010,
  forestgain: ForestGain,
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
