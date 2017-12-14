/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as country from 'pages/country/root';

const countryReducers = {
  root: handleActions(country)
};

// Components
import * as ShareComponent from 'components/share';
import * as mapComponent from 'components/map';
import * as storiesComponent from 'pages/country/stories';
import * as headerComponent from 'pages/country/header';
import * as widgetAreasMostCoverGainComponent from 'pages/country/widget/widgets/widget-areas-most-cover-gain';
import * as widgetPlantationAreaComponent from 'pages/country/widget/widgets/widget-plantation-area';
import * as widgetTotalAreaPlantationsComponent from 'pages/country/widget/widgets/widget-total-area-plantations';
import * as widgetTreeCoverComponent from 'pages/country/widget/widgets/widget-tree-cover';
import * as widgetTreeCoverGainComponent from 'pages/country/widget/widgets/widget-tree-gain';
import * as widgetTreeCoverLossAreasComponent from 'pages/country/widget/widgets/widget-tree-cover-loss-areas';
import * as widgetTreeLocatedComponent from 'pages/country/widget/widgets/widget-tree-located';
import * as widgetTreeLossComponent from 'pages/country/widget/widgets/widget-tree-loss';
import * as widgetFAOForestComponent from 'pages/country/widget/widgets/widget-fao-forest';
import * as widgetFAOExtentComponent from 'pages/country/widget/widgets/widget-fao-extent';

// Providers
import * as countryDataProviderComponent from 'pages/country/providers/country-data-provider';

const componentsReducers = {
  share: handleActions(ShareComponent),
  map: handleActions(mapComponent),
  stories: handleActions(storiesComponent),
  header: handleActions(headerComponent),
  widgetAreasMostCoverGain: handleActions(widgetAreasMostCoverGainComponent),
  widgetPlantationArea: handleActions(widgetPlantationAreaComponent),
  widgetTotalAreaPlantations: handleActions(
    widgetTotalAreaPlantationsComponent
  ),
  widgetTreeCover: handleActions(widgetTreeCoverComponent),
  widgetTreeCoverGain: handleActions(widgetTreeCoverGainComponent),
  widgetTreeCoverLossAreas: handleActions(widgetTreeCoverLossAreasComponent),
  widgetTreeLocated: handleActions(widgetTreeLocatedComponent),
  widgetTreeLoss: handleActions(widgetTreeLossComponent),
  widgetFAOForest: handleActions(widgetFAOForestComponent),
  widgetFAOExtent: handleActions(widgetFAOExtentComponent)
};

const providersReducers = {
  countryData: handleActions(countryDataProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...countryReducers,
  ...componentsReducers,
  location: router.reducer
});
