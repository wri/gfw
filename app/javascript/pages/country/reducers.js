/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as ShareComponent from 'components/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as mapComponent from 'components/map';
import * as storiesComponent from 'pages/country/stories';
import * as headerComponent from 'pages/country/header';
import * as widgetTreeCoverComponent from 'components/widget/widgets/widget-tree-cover';
import * as widgetTreeCoverPlantationsComponent from 'components/widget/widgets/widget-tree-cover-plantations';
import * as widgetIntactTreeCoverComponent from 'components/widget/widgets/widget-intact-tree-cover';
import * as widgetPrimaryTreeCoverComponent from 'components/widget/widgets/widget-primary-tree-cover';
import * as widgetTreeGainComponent from 'components/widget/widgets/widget-tree-gain';
import * as widgetTreeLocatedComponent from 'components/widget/widgets/widget-tree-located';
import * as widgetGainLocatedComponent from 'components/widget/widgets/widget-gain-located';
import * as widgetLossLocatedComponent from 'components/widget/widgets/widget-loss-located';
import * as widgetTreeLossComponent from 'components/widget/widgets/widget-tree-loss';
import * as widgetLossRankedComponent from 'components/widget/widgets/widget-loss-ranked';
import * as widgetTreeCoverRankedComponent from 'components/widget/widgets/widget-tree-cover-ranked';
import * as widgetTreeLossPlantationsComponent from 'components/widget/widgets/widget-tree-loss-plantations';
import * as widgetFAOCoverComponent from 'components/widget/widgets/widget-fao-cover';
import * as widgetFAOReforestationComponent from 'components/widget/widgets/widget-fao-reforestation';
import * as widgetFAODeforestationComponent from 'components/widget/widgets/widget-fao-deforestation';
import * as widgetGladAlertsComponent from 'components/widget/widgets/widget-glad-alerts';
import * as widgetGladBiodiversityComponent from 'components/widget/widgets/widget-glad-biodiversity';
import * as widgetGladRankedComponent from 'components/widget/widgets/widget-glad-ranked';
import * as widgetRankedPlantationsComponent from 'components/widget/widgets/widget-ranked-plantations';
import * as widgetEmissionsComponent from 'components/widget/widgets/widget-emissions';
import * as widgetEmissionsDeforestationComponent from 'components/widget/widgets/widget-emissions-deforestation';
import * as widgetFiresComponent from 'components/widget/widgets/widget-fires';
import * as widgetForestryEmploymentComponent from 'components/widget/widgets/widget-forestry-employment';
import * as widgetEconomicImpactComponent from 'components/widget/widgets/widget-economic-impact';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as whitelistsProviderComponent from 'providers/whitelists-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  map: handleActions(mapComponent),
  stories: handleActions(storiesComponent),
  header: handleActions(headerComponent),
  widgetTreeCover: handleActions(widgetTreeCoverComponent),
  widgetTreeCoverPlantations: handleActions(
    widgetTreeCoverPlantationsComponent
  ),
  widgetIntactTreeCover: handleActions(widgetIntactTreeCoverComponent),
  widgetPrimaryTreeCover: handleActions(widgetPrimaryTreeCoverComponent),
  widgetTreeGain: handleActions(widgetTreeGainComponent),
  widgetTreeLocated: handleActions(widgetTreeLocatedComponent),
  widgetGainLocated: handleActions(widgetGainLocatedComponent),
  widgetLossLocated: handleActions(widgetLossLocatedComponent),
  widgetTreeLoss: handleActions(widgetTreeLossComponent),
  widgetLossRanked: handleActions(widgetLossRankedComponent),
  widgetTreeCoverRanked: handleActions(widgetTreeCoverRankedComponent),
  widgetTreeLossPlantations: handleActions(widgetTreeLossPlantationsComponent),
  widgetFAOCover: handleActions(widgetFAOCoverComponent),
  widgetFAOReforestation: handleActions(widgetFAOReforestationComponent),
  widgetFAODeforestation: handleActions(widgetFAODeforestationComponent),
  widgetGladAlerts: handleActions(widgetGladAlertsComponent),
  widgetGladBiodiversity: handleActions(widgetGladBiodiversityComponent),
  widgetGladRanked: handleActions(widgetGladRankedComponent),
  widgetRankedPlantations: handleActions(widgetRankedPlantationsComponent),
  widgetEmissions: handleActions(widgetEmissionsComponent),
  widgetEmissionsDeforestation: handleActions(
    widgetEmissionsDeforestationComponent
  ),
  widgetFires: handleActions(widgetFiresComponent),
  widgetForestryEmployment: handleActions(widgetForestryEmploymentComponent),
  widgetEconomicImpact: handleActions(widgetEconomicImpactComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent),
  whitelists: handleActions(whitelistsProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
