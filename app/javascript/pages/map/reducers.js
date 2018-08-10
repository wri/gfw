/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as recentImageryComponent from 'components/map/components/recent-imagery';
import * as MapMenuComponent from 'pages/map/menu';
import * as DataAnalysisMenuComponent from 'pages/map/data-analysis-menu';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as WidgetsComponent from 'components/widgets';
import * as PopupComponent from 'components/map/components/popup';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as whitelistsProviderComponent from 'providers/whitelists-provider';
import * as datasetsProviderComponent from 'providers/datasets-provider';
import * as layerSpecProviderComponent from 'providers/layerspec-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  mapMenu: handleActions(MapMenuComponent),
  dataAnalysis: handleActions(DataAnalysisMenuComponent),
  recentImagery: handleActions(recentImageryComponent),
  widgets: handleActions(WidgetsComponent),
  popup: handleActions(PopupComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent),
  whitelists: handleActions(whitelistsProviderComponent),
  datasets: handleActions(datasetsProviderComponent),
  layerSpec: handleActions(layerSpecProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});
