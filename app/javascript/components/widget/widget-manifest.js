// Land cover
import * as treeCover from './widgetz/extent/tree-cover';
import * as treeCoverRanked from './widgetz/extent/tree-cover-ranked';
import * as treeCoverLocated from './widgetz/extent/tree-cover-located';
import * as intactTreeCover from './widgetz/extent/intact-tree-cover';
import * as primaryForest from './widgetz/extent/primary-forest';

// Forest change
import * as gladAlerts from './widgetz/alerts/glad-alerts';
import * as gladRanked from './widgetz/alerts/glad-ranked';
import * as fires from './widgetz/alerts/fires';
import * as treeLossLocated from './widgetz/loss/tree-loss-located';
import * as treeCoverGain from './widgetz/gain/tree-cover-gain';
import * as treeGainLocated from './widgetz/gain/tree-gain-located';

// Land use
import * as treeCoverPlantations from './widgetz/extent/tree-cover-plantations';
import * as rankedPlantations from './widgetz/extent/ranked-plantations';

// Conservation
import * as gladBiodiversity from './widgetz/alerts/glad-biodiversity';

// People
import * as economicImpact from './widgetz/people/economic-impact';
import * as forestryEmployment from './widgetz/people/forestry-employment';

// Climate
import * as emissions from './widgetz/climate/emissions';
import * as emissionsDeforestation from './widgetz/climate/emissions-deforestation';

export {
  treeCover,
  treeCoverPlantations,
  intactTreeCover,
  primaryForest,
  emissions,
  emissionsDeforestation,
  fires,
  gladAlerts,
  treeCoverLocated,
  treeCoverRanked,
  gladBiodiversity,
  gladRanked,
  rankedPlantations,
  treeLossLocated,
  treeCoverGain,
  treeGainLocated,
  economicImpact,
  forestryEmployment
};
