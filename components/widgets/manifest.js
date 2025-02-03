// forest change
import treeLoss from 'components/widgets/forest-change/tree-loss';
import treeLossPct from 'components/widgets/forest-change/tree-loss-primary';
import treeLossGlobal from 'components/widgets/forest-change/tree-loss-global';
import treeLossRanked from 'components/widgets/forest-change/tree-loss-ranked';
import faoDeforest from 'components/widgets/forest-change/fao-deforest';
import faoReforest from 'components/widgets/forest-change/fao-reforest';
import treeCoverGain from 'components/widgets/forest-change/tree-cover-gain';
import treeCoverGainOutsidePlantations from 'components/widgets/forest-change/tree-cover-gain-outside-plantations';
import treeGainLocated from 'components/widgets/forest-change/tree-gain-located';
import treeLossLocated from 'components/widgets/forest-change/tree-loss-located';
import treeLossPlantations from 'components/widgets/forest-change/tree-loss-plantations';
import treeLossTsc from 'components/widgets/forest-change/tree-loss-drivers';
import treeCoverGainSimple from 'components/widgets/forest-change/tree-cover-gain-simple';
import glads from 'components/widgets/forest-change/glads';
// import gladRanked from 'components/widgets/forest-change/glad-ranked';
import integratedAlertsRanked from 'components/widgets/forest-change/integrated-alerts-ranked';
import integratedDeforestationAlerts from 'components/widgets/forest-change/integrated-deforestation-alerts';

// fires
import firesAlerts from 'components/widgets/fires/fires-alerts';
import burnedAreaCumulative from 'components/widgets/fires/burned-area-cumulative';
import burnedAreaRanked from 'components/widgets/fires/burned-area-ranked';
import firesAlertsHistorical from 'components/widgets/fires/fires-alerts-historical-weekly';
import firesAlertsHistoricalDaily from 'components/widgets/fires/fires-alerts-historical-daily';
import firesAlertsSimple from 'components/widgets/fires/fire-alerts-simple';
import treeLossFires from 'components/widgets/fires/tree-loss-fires';
import treeCoverLossFiresAnnual from 'components/widgets/fires/tree-loss-fires-annual';
import treeCoverLossFiresProportion from 'components/widgets/fires/tree-loss-fires-proportion';

// land cover
import treeCover from 'components/widgets/land-cover/tree-cover';
import treeCover2000 from 'components/widgets/land-cover/tree-cover-2000';
import treeCover2010 from 'components/widgets/land-cover/tree-cover-2010';
import treeCoverRanked from 'components/widgets/land-cover/tree-cover-ranked';
import treeCoverPlantations from 'components/widgets/land-cover/tree-cover-plantations';
import rankedPlantations from 'components/widgets/land-cover/ranked-plantations';
import faoCover from 'components/widgets/land-cover/fao-cover';
import intactTreeCover from 'components/widgets/land-cover/intact-tree-cover';
import primaryForest from 'components/widgets/land-cover/primary-forest';
import treeCoverLocated from 'components/widgets/land-cover/tree-cover-located';
import USLandCover from 'components/widgets/land-cover/us-land-cover';
import rankedForestTypes from 'components/widgets/land-cover/ranked-forest-types';
import treeCoverDensity from 'components/widgets/land-cover/tree-cover-density';
import naturalForest from 'components/widgets/land-cover/natural-forest';

// Climate
import woodyBiomass from 'components/widgets/climate/whrc-biomass/';
import soilBiomass from 'components/widgets/climate/soil-organic';
import carbonFlux from 'components/widgets/climate/carbon-flux';
import emissionsDeforestation from 'components/widgets/climate/emissions-deforestation';
import emissionsDeforestationDrivers from 'components/widgets/climate/emissions-deforestation-drivers';
import carbonStock from 'components/widgets/climate/carbon-stock';

// Land Use
import economicImpact from 'components/widgets/land-use/economic-impact';
import forestryEmployment from 'components/widgets/land-use/forestry-employment';
import traseCommodities from 'components/widgets/land-use/trase-commodities';
import netChange from 'components/widgets/forest-change/net-change';

export default {
  // forest change
  treeLoss,
  treeLossPct,
  treeLossGlobal,
  treeLossRanked,
  faoDeforest,
  faoReforest,
  treeCoverGain,
  treeCoverGainOutsidePlantations,
  treeGainLocated,
  treeLossLocated,
  treeLossPlantations,
  treeLossTsc,
  treeCoverGainSimple,
  glads,
  // gladRanked,
  integratedAlertsRanked,
  integratedDeforestationAlerts,
  netChange,

  // fires
  firesAlerts,
  burnedAreaCumulative,
  burnedAreaRanked,
  firesAlertsHistorical,
  firesAlertsHistoricalDaily,
  firesAlertsSimple,
  treeLossFires,
  treeCoverLossFiresAnnual,
  treeCoverLossFiresProportion,

  // land cover
  treeCover,
  treeCover2000,
  treeCover2010,
  treeCoverRanked,
  rankedPlantations,
  USLandCover,
  treeCoverPlantations,
  faoCover,
  intactTreeCover,
  primaryForest,
  treeCoverLocated,
  rankedForestTypes,
  treeCoverDensity,
  naturalForest,

  // climate
  // emissions,
  carbonFlux,
  emissionsDeforestation,
  emissionsDeforestationDrivers,
  woodyBiomass,
  soilBiomass,
  carbonStock,

  // land use
  economicImpact,
  forestryEmployment,
  traseCommodities,
};
