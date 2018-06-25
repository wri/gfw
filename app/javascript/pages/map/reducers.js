/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as MapComponent from 'components/map';
import * as MapMenuComponent from 'pages/map/menu';
import * as recentImageryComponent from 'pages/map/recent-imagery';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';

// Component Reducers
const componentsReducers = {
  map: handleActions(MapComponent),
  mapMenu: handleActions(MapMenuComponent),
  recentImagery: handleActions(recentImageryComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
