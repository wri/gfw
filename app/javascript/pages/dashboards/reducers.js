/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Page
import * as PageComponent from 'pages/dashboards/page';

// Components
import * as HeaderComponent from 'pages/dashboards/header';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as WidgetsComponent from 'components/widgets';
import * as MapComponent from 'components/map-old';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as whitelistsProviderComponent from 'providers/whitelists-provider';
import * as layerSpecProviderComponent from 'providers/layerspec-provider';
import * as datasetsProviderComponent from 'providers/datasets-provider';

// Page Reducers
const pageReducers = {
  page: handleActions(PageComponent)
};

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  header: handleActions(HeaderComponent),
  widgets: handleActions(WidgetsComponent),
  map: handleActions(MapComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent),
  whitelists: handleActions(whitelistsProviderComponent),
  layerSpec: handleActions(layerSpecProviderComponent),
  datasets: handleActions(datasetsProviderComponent)
};

export default combineReducers({
  ...pageReducers,
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
