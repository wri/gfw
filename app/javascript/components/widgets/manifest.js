// // forest change
import gladAlerts from 'components/widgets/forest-change/glad-alerts';
import treeLoss from 'components/widgets/forest-change/tree-loss';
import treeLossWithin from 'components/widgets/forest-change/tree-loss-within';
import treeLossGlobal from 'components/widgets/forest-change/tree-loss-global';
import treeLossRanked from 'components/widgets/forest-change/tree-loss-ranked';
import faoDeforest from 'components/widgets/forest-change/fao-deforest';
import faoReforest from 'components/widgets/forest-change/fao-reforest';
import firesAlerts from 'components/widgets/forest-change/fires-alerts';
import firesRanked from 'components/widgets/forest-change/fires-ranked';
import gladRanked from 'components/widgets/forest-change/glad-ranked';
import treeCoverGain from 'components/widgets/forest-change/tree-cover-gain';
import treeGainLocated from 'components/widgets/forest-change/tree-gain-located';
import treeLossLocated from 'components/widgets/forest-change/tree-loss-located';
import treeLossPlantations from 'components/widgets/forest-change/tree-loss-plantations';
import treeLossTsc from 'components/widgets/forest-change/tree-loss-tsc';
import fires from 'components/widgets/forest-change/fires';
import treeCoverGainSimple from 'components/widgets/forest-change/tree-cover-gain-simple';
import glads from 'components/widgets/forest-change/glads';

// // land cover
import treeCover from 'components/widgets/land-cover/tree-cover';
import treeCover2000 from 'components/widgets/land-cover/tree-cover-2000';
import treeCover2010 from 'components/widgets/land-cover/tree-cover-2010';
import treeCoverRanked from 'components/widgets/land-cover/tree-cover-ranked';
import treeCoverPlantations from 'components/widgets/land-cover/tree-cover-plantations';
import rankedPlantations from 'components/widgets/land-cover/ranked-plantations';
import faoCover from 'components/widgets/land-cover/fao-cover';
import globalLandCover from 'components/widgets/land-cover/global-land-cover';
import intactTreeCover from 'components/widgets/land-cover/intact-tree-cover';
import primaryForest from 'components/widgets/land-cover/primary-forest';
import treeCoverLocated from 'components/widgets/land-cover/tree-cover-located';
import USLandCover from 'components/widgets/land-cover/us-land-cover';

// // Climate
import emissions from 'components/widgets/climate/emissions';
import woodyBiomass from 'components/widgets/climate/whrc-biomass/';
import soilBiomass from 'components/widgets/climate/soil-organic';
import emissionsDeforestation from 'components/widgets/climate/emissions-deforestation';
import emissionsPlantations from 'components/widgets/climate/emissions-plantations';
import futureCarbonGains from 'components/widgets/climate/future-carbon-gains';
import cumulativeEmissions from 'components/widgets/climate/cumulative-emissions';
import carbonStock from 'components/widgets/climate/carbon-stock';

// // Land Use
import economicImpact from 'components/widgets/land-use/economic-impact';
import forestryEmployment from 'components/widgets/land-use/forestry-employment';
import traseCommodities from 'components/widgets/land-use/trase-commodities';

export default {
  // forest change
  glads,
  gladAlerts,
  treeLoss,
  treeLossWithin,
  treeLossGlobal,
  treeLossRanked,
  firesAlerts,
  fires,
  firesRanked,
  faoDeforest,
  faoReforest,
  gladRanked,
  treeCoverGain,
  treeGainLocated,
  treeLossLocated,
  treeLossPlantations,
  treeLossTsc,
  treeCoverGainSimple,
  // land cover
  treeCover,
  treeCover2000,
  treeCover2010,
  treeCoverRanked,
  rankedPlantations,
  USLandCover,
  treeCoverPlantations,
  faoCover,
  globalLandCover,
  intactTreeCover,
  primaryForest,
  treeCoverLocated,
  // climate
  emissions,
  emissionsDeforestation,
  emissionsPlantations,
  woodyBiomass,
  soilBiomass,
  futureCarbonGains,
  cumulativeEmissions,
  carbonStock,
  // land use
  economicImpact,
  forestryEmployment,
  traseCommodities
};
