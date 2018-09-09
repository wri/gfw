/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as RecentImageryComponent from 'components/map-v2/components/recent-imagery';
import * as DataAnalysisMenuComponent from 'pages/map-v2/data-analysis-menu';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as WidgetsComponent from 'components/widgets';
import * as PopupComponent from 'components/map-v2/components/popup';

// Providers
import * as CountryDataProviderComponent from 'providers/country-data-provider';
import * as GeostoreProviderComponent from 'providers/geostore-provider';
import * as WhitelistsProviderComponent from 'providers/whitelists-provider';
import * as DatasetsProviderComponent from 'providers/datasets-provider';
import * as MyGFWProviderComponent from 'providers/mygfw-provider';
import * as PTWProviderComponent from 'providers/ptw-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  dataAnalysis: handleActions(DataAnalysisMenuComponent),
  recentImagery: handleActions(RecentImageryComponent),
  widgets: handleActions(WidgetsComponent),
  popup: handleActions(PopupComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(CountryDataProviderComponent),
  geostore: handleActions(GeostoreProviderComponent),
  whitelists: handleActions(WhitelistsProviderComponent),
  datasets: handleActions(DatasetsProviderComponent),
  myGfw: handleActions(MyGFWProviderComponent),
  ptw: handleActions(PTWProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
