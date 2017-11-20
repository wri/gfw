/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as country from 'pages/country/components/root/root';

const countryReducers = {
  root: handleActions(country)
};

// Components
import * as headerComponent from 'pages/country/components/header/header';
import * as mapComponent from 'pages/country/components/map/map';
import * as widgetAreasMostCoverGainComponent from 'pages/country/components/widget-areas-most-cover-gain/widget-areas-most-cover-gain';
import * as widgetPlantationAreaComponent from 'pages/country/components/widget-plantation-area/widget-plantation-area';
import * as widgetStoriesComponent from 'pages/country/components/widget-stories/widget-stories';
import * as widgetTotalAreaPlantationsComponent from 'pages/country/components/widget-total-area-plantations/widget-total-area-plantations';
import * as widgetTreeCoverComponent from 'pages/country/components/widget-tree-cover/widget-tree-cover';
import * as widgetTreeCoverGainComponent from 'pages/country/components/widget-tree-cover-gain/widget-tree-cover-gain';
import * as widgetTreeCoverLossAreasComponent from 'pages/country/components/widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';
import * as widgetTreeLocatedComponent from 'pages/country/components/widget-tree-located/widget-tree-located';
import * as widgetTreeLossComponent from 'pages/country/components/widget-tree-loss/widget-tree-loss';

const componentsReducers = {
  header: handleActions(headerComponent),
  map: handleActions(mapComponent),
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

export default combineReducers({
  ...countryReducers,
  ...componentsReducers,
  location: router.reducer
});
