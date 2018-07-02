/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as recentImageryComponent from 'pages/map/recent-imagery';
import * as MapComponent from 'components/map';
import * as MapMenuComponent from 'pages/map/menu';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as datasetsProviderComponent from 'providers/datasets-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  map: handleActions(MapComponent),
  mapMenu: handleActions(MapMenuComponent),
  recentImagery: handleActions(recentImageryComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent),
  datasets: handleActions(datasetsProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
