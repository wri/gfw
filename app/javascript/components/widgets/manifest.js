// Land cover
import * as treeCover from './widgets/land-cover/tree-cover';
import * as treeCoverRanked from './widgets/land-cover/tree-cover-ranked';
import * as treeCoverLocated from './widgets/land-cover/tree-cover-located';
import * as intactTreeCover from './widgets/land-cover/intact-tree-cover';
import * as primaryForest from './widgets/land-cover/primary-forest';
import * as faoCover from './widgets/land-cover/fao-cover';
import * as treeCoverPlantations from './widgets/land-cover/tree-cover-plantations';
import * as rankedPlantations from './widgets/land-cover/ranked-plantations';
import * as globalLandCover from './widgets/land-cover/global-land-cover';

// Forest change
import * as gladAlerts from './widgets/forest-change/glad-alerts';
import * as gladRanked from './widgets/forest-change/glad-ranked';
import * as firesAlerts from './widgets/forest-change/fires-alerts';
import * as treeLossLocated from './widgets/forest-change/tree-loss-located';
import * as treeCoverGain from './widgets/forest-change/tree-cover-gain';
import * as treeGainLocated from './widgets/forest-change/tree-gain-located';
import * as treeLossRanked from './widgets/forest-change/tree-loss-ranked';
import * as treeLossPlantations from './widgets/forest-change/tree-loss-plantations';
import * as treeLoss from './widgets/forest-change/tree-loss';
import * as treeLossGlobal from './widgets/forest-change/tree-loss-global';
import * as faoDeforest from './widgets/forest-change/fao-deforest';
import * as faoReforest from './widgets/forest-change/fao-reforest';

// Conservation
import * as gladBiodiversity from './widgets/conservation/glad-biodiversity';

// People
import * as economicImpact from './widgets/people/economic-impact';
import * as forestryEmployment from './widgets/people/forestry-employment';

// Climate
import * as emissions from './widgets/climate/emissions';
import * as emissionsDeforestation from './widgets/climate/emissions-deforestation';

export {
  // land cover
  treeCover,
  treeCoverRanked,
  intactTreeCover,
  primaryForest,
  treeCoverLocated,
  faoCover,
  treeCoverPlantations,
  rankedPlantations,
  globalLandCover,
  // forest change
  gladAlerts,
  gladRanked,
  firesAlerts,
  treeLossLocated,
  treeCoverGain,
  treeGainLocated,
  treeLossRanked,
  treeLossPlantations,
  treeLoss,
  treeLossGlobal,
  faoDeforest,
  faoReforest,
  // conservation
  gladBiodiversity,
  // people
  economicImpact,
  forestryEmployment,
  // climate
  emissions,
  emissionsDeforestation
};
