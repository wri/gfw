// Land cover
import * as treeCover from './widgetz/land-cover/tree-cover';
import * as treeCoverRanked from './widgetz/land-cover/tree-cover-ranked';
import * as treeCoverLocated from './widgetz/land-cover/tree-cover-located';
import * as intactTreeCover from './widgetz/land-cover/intact-tree-cover';
import * as primaryForest from './widgetz/land-cover/primary-forest';
import * as faoCover from './widgetz/land-cover/fao-cover';

// Forest change
import * as gladAlerts from './widgetz/forest-change/glad-alerts';
import * as gladRanked from './widgetz/forest-change/glad-ranked';
import * as fires from './widgetz/forest-change/fires';
import * as treeLossLocated from './widgetz/forest-change/tree-loss-located';
import * as treeCoverGain from './widgetz/forest-change/tree-cover-gain';
import * as treeGainLocated from './widgetz/forest-change/tree-gain-located';
import * as treeLossRanked from './widgetz/forest-change/tree-loss-ranked';
import * as treeLossPlantations from './widgetz/forest-change/tree-loss-plantations';
import * as treeLoss from './widgetz/forest-change/tree-loss';
import * as faoDeforest from './widgetz/forest-change/fao-deforest';
import * as faoReforest from './widgetz/forest-change/fao-reforest';

// Land use
import * as treeCoverPlantations from './widgetz/land-use/tree-cover-plantations';
import * as rankedPlantations from './widgetz/land-use/ranked-plantations';

// Conservation
import * as gladBiodiversity from './widgetz/conservation/glad-biodiversity';

// People
import * as economicImpact from './widgetz/people/economic-impact';
import * as forestryEmployment from './widgetz/people/forestry-employment';

// Climate
import * as emissions from './widgetz/climate/emissions';
import * as emissionsDeforestation from './widgetz/climate/emissions-deforestation';

export {
  // land cover
  treeCover,
  treeCoverRanked,
  intactTreeCover,
  primaryForest,
  treeCoverLocated,
  faoCover,
  // forest change
  gladAlerts,
  gladRanked,
  fires,
  treeLossLocated,
  treeCoverGain,
  treeGainLocated,
  treeLossRanked,
  treeLossPlantations,
  treeLoss,
  faoDeforest,
  faoReforest,
  // land use
  treeCoverPlantations,
  rankedPlantations,
  // conservation
  gladBiodiversity,
  // people
  economicImpact,
  forestryEmployment,
  // climate
  emissions,
  emissionsDeforestation
};
