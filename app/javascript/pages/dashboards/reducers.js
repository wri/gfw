/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as HeaderComponent from 'pages/dashboards/header';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as MapComponent from 'components/map';
import * as WidgetsComponent from 'components/widgets';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as whitelistsProviderComponent from 'providers/whitelists-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  map: handleActions(MapComponent),
  header: handleActions(HeaderComponent),
  widgets: handleActions(WidgetsComponent)
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
