// forest change
import * as gladAlerts from './widgets/forest-change/glad-alerts';
import * as treeLoss from './widgets/forest-change/tree-loss';
import * as treeLossGlobal from './widgets/forest-change/tree-loss-global';
import * as treeLossRanked from './widgets/forest-change/tree-loss-ranked';
import * as faoDeforest from './widgets/forest-change/fao-deforest';
import * as faoReforest from './widgets/forest-change/fao-reforest';
import * as firesAlerts from './widgets/forest-change/fires-alerts';
import * as gladRanked from './widgets/forest-change/glad-ranked';
import * as treeCoverGain from './widgets/forest-change/tree-cover-gain';
import * as treeGainLocated from './widgets/forest-change/tree-gain-located';
import * as treeLossLocated from './widgets/forest-change/tree-loss-located';
import * as treeLossPlantations from './widgets/forest-change/tree-loss-plantations';
import * as treeLossTsc from './widgets/forest-change/tree-loss-tsc';

// land cover
import * as treeCover from './widgets/land-cover/tree-cover';
import * as treeCover2000 from './widgets/land-cover/tree-cover-2000';
import * as treeCover2010 from './widgets/land-cover/tree-cover-2010';
import * as treeCoverRanked from './widgets/land-cover/tree-cover-ranked';
import * as treeCoverPlantations from './widgets/land-cover/tree-cover-plantations';
import * as rankedPlantations from './widgets/land-cover/ranked-plantations';
import * as faoCover from './widgets/land-cover/fao-cover';
import * as globalLandCover from './widgets/land-cover/global-land-cover';
import * as intactTreeCover from './widgets/land-cover/intact-tree-cover';
import * as primaryForest from './widgets/land-cover/primary-forest';
import * as treeCoverLocated from './widgets/land-cover/tree-cover-located';

// Climate
import * as emissions from './widgets/climate/emissions';
import * as woodyBiomass from './widgets/climate/whrc-biomass/';
import * as soilBiomass from './widgets/climate/soil-organic';
import * as emissionsPlantations from './widgets/climate/emissions-plantations';
import * as futureCarbonGains from './widgets/climate/future-carbon-gains';
import * as cumulativeEmissions from './widgets/climate/cumulative-emissions';
import * as carbonStock from './widgets/climate/carbon-stock';

// Biodiversity
// import * as gladBiodiversity from './widgets/biodiversity/glad-biodiversity';

// Land Use
import * as economicImpact from './widgets/land-use/economic-impact';
import * as forestryEmployment from './widgets/land-use/forestry-employment';

import * as traseCommodities from './widgets/land-use/trase-commodities';

export default {
  // forest change
  gladAlerts,
  treeLoss,
  treeLossGlobal,
  treeLossRanked,
  firesAlerts,
  faoDeforest,
  faoReforest,
  gladRanked,
  treeCoverGain,
  treeGainLocated,
  treeLossLocated,
  treeLossPlantations,
  treeLossTsc,
  // land cover
  treeCover,
  treeCover2000,
  treeCover2010,
  treeCoverRanked,
  rankedPlantations,
  treeCoverPlantations,
  faoCover,
  globalLandCover,
  intactTreeCover,
  primaryForest,
  treeCoverLocated,
  // climate
  emissions,
  emissionsPlantations,
  woodyBiomass,
  soilBiomass,
  futureCarbonGains,
  cumulativeEmissions,
  carbonStock,
  // biodiversity
  // gladBiodiversity,
  // land use
  economicImpact,
  forestryEmployment,
  traseCommodities
};
