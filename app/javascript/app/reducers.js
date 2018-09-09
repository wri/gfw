/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';
import { reducer as formReducer } from 'redux-form';

// Routes
import router from './router';

// Components
import * as RecentImageryComponent from 'components/map-v2/components/recent-imagery';
import * as DataAnalysisMenuComponent from 'pages/map-v2/components/data-analysis-menu';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as WidgetsComponent from 'components/widgets';
import * as PopupComponent from 'components/map-v2/components/popup';
import * as HeaderComponent from 'pages/dashboards/header';
import * as MapComponent from 'components/map';
import * as impacts from 'pages/about/section-impacts';
import * as projects from 'pages/about/section-projects';
import * as contact from 'pages/about/section-contact';
import * as projectsModal from 'pages/about/section-projects/section-projects-modal';
import * as modalVideo from 'components/modals/video';

// Providers
import * as CountryDataProviderComponent from 'providers/country-data-provider';
import * as GeostoreProviderComponent from 'providers/geostore-provider';
import * as WhitelistsProviderComponent from 'providers/whitelists-provider';
import * as DatasetsProviderComponent from 'providers/datasets-provider';
import * as MyGFWProviderComponent from 'providers/mygfw-provider';
import * as PTWProviderComponent from 'providers/ptw-provider';
import * as LayerSpecProviderComponent from 'providers/layerspec-provider';

// pages
import * as DashboardsPageComponent from 'pages/dashboards';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  dataAnalysis: handleActions(DataAnalysisMenuComponent),
  recentImagery: handleActions(RecentImageryComponent),
  widgets: handleActions(WidgetsComponent),
  popup: handleActions(PopupComponent),
  header: handleActions(HeaderComponent),
  map: handleActions(MapComponent),
  impacts: handleActions(impacts),
  projects: handleActions(projects),
  contact: handleActions(contact),
  projectsModal: handleActions(projectsModal),
  modalVideo: handleActions(modalVideo)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(CountryDataProviderComponent),
  geostore: handleActions(GeostoreProviderComponent),
  whitelists: handleActions(WhitelistsProviderComponent),
  datasets: handleActions(DatasetsProviderComponent),
  myGfw: handleActions(MyGFWProviderComponent),
  ptw: handleActions(PTWProviderComponent),
  layerSpec: handleActions(LayerSpecProviderComponent)
};

// Page Reducers
const pageReducers = {
  dashboards: handleActions(DashboardsPageComponent)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  ...pageReducers,
  form: formReducer,
  location: router.reducer
});
