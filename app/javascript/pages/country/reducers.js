/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as country from 'pages/country/root/root';

const countryReducers = {
  root: handleActions(country)
};

// Components
import * as ShareComponent from 'components/share/share';
import * as mapComponent from 'pages/country/map/map';
import * as widgetHeaderComponent from 'pages/country/widgets/widget-header/widget-header';
import * as widgetAreasMostCoverGainComponent from 'pages/country/widgets/widget-areas-most-cover-gain/widget-areas-most-cover-gain';
import * as widgetPlantationAreaComponent from 'pages/country/widgets/widget-plantation-area/widget-plantation-area';
import * as widgetStoriesComponent from 'pages/country/widgets/widget-stories/widget-stories';
import * as widgetTotalAreaPlantationsComponent from 'pages/country/widgets/widget-total-area-plantations/widget-total-area-plantations';
import * as widgetTreeCoverComponent from 'pages/country/widgets/widget-tree-cover/widget-tree-cover';
import * as widgetTreeCoverGainComponent from 'pages/country/widgets/widget-tree-cover-gain/widget-tree-cover-gain';
import * as widgetTreeCoverLossAreasComponent from 'pages/country/widgets/widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';
import * as widgetTreeLocatedComponent from 'pages/country/widgets/widget-tree-located/widget-tree-located';
import * as widgetTreeLossComponent from 'pages/country/widgets/widget-tree-loss/widget-tree-loss';

// Providers
import * as countryDataProviderComponent from 'pages/country/providers/country-data-provider';

const componentsReducers = {
  share: handleActions(ShareComponent),
  map: handleActions(mapComponent),
  widgetHeader: handleActions(widgetHeaderComponent),
  widgetAreasMostCoverGain: handleActions(widgetAreasMostCoverGainComponent),
  widgetPlantationArea: handleActions(widgetPlantationAreaComponent),
  widgetStories: handleActions(widgetStoriesComponent),
  widgetTotalAreaPlantations: handleActions(
    widgetTotalAreaPlantationsComponent
  ),
  widgetTreeCover: handleActions(widgetTreeCoverComponent),
  widgetTreeCoverGain: handleActions(widgetTreeCoverGainComponent),
  widgetTreeCoverLossAreas: handleActions(widgetTreeCoverLossAreasComponent),
  widgetTreeLocated: handleActions(widgetTreeLocatedComponent),
  widgetTreeLoss: handleActions(widgetTreeLossComponent)
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
