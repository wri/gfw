/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';
import { reducer as formReducer } from 'redux-form';

// Routes
import router from './router';

// Components
import { reduxModule as RecentImagery } from 'components/map-v2/components/recent-imagery';
import { reduxModule as RecentImageryOld } from 'pages/map/recent-imagery';
import { reduxModule as DataAnalysisMenu } from 'pages/map-v2/components/data-analysis-menu';
import { reduxModule as Share } from 'components/modals/share';
import { reduxModule as ModalMeta } from 'components/modals/meta';
import { reduxModule as Widgets } from 'components/widgets';
import { reduxModule as Popup } from 'components/map-v2/components/popup';
import { reduxModule as Header } from 'pages/dashboards/header';
import { reduxModule as MapComponent } from 'components/map';
import { reduxModule as impacts } from 'pages/about/section-impacts';
import { reduxModule as aboutProjects } from 'pages/about/section-projects';
import { reduxModule as sgfProjects } from 'pages/sgf/section-projects';
import { reduxModule as contact } from 'pages/about/section-contact';
import { reduxModule as projectsModal } from 'pages/about/section-projects/section-projects-modal';
import { reduxModule as modalVideo } from 'components/modals/video';

// Providers
import { reduxModule as CountryDataProvider } from 'providers/country-data-provider';
import { reduxModule as GeostoreProvider } from 'providers/geostore-provider';
import { reduxModule as WhitelistsProvider } from 'providers/whitelists-provider';
import { reduxModule as DatasetsProvider } from 'providers/datasets-provider';
import { reduxModule as MyGFWProvider } from 'providers/mygfw-provider';
import { reduxModule as PTWProvider } from 'providers/ptw-provider';
import { reduxModule as LayerSpecProvider } from 'providers/layerspec-provider';

// pages
import { reduxModule as DashboardsPage } from 'pages/dashboards';
import { reduxModule as MapPage } from 'pages/map';

// Component Reducers
const componentsReducers = {
  share: handleModule(Share),
  modalMeta: handleModule(ModalMeta),
  dataAnalysis: handleModule(DataAnalysisMenu),
  recentImagery: handleModule(RecentImagery),
  recentImageryOld: handleModule(RecentImageryOld),
  widgets: handleModule(Widgets),
  popup: handleModule(Popup),
  header: handleModule(Header),
  map: handleModule(MapComponent),
  impacts: handleModule(impacts),
  aboutProjects: handleModule(aboutProjects),
  sgfProjects: handleModule(sgfProjects),
  contact: handleModule(contact),
  projectsModal: handleModule(projectsModal),
  modalVideo: handleModule(modalVideo)
};

// Provider Reducers
const providersReducers = {
  countryData: handleModule(CountryDataProvider),
  geostore: handleModule(GeostoreProvider),
  whitelists: handleModule(WhitelistsProvider),
  datasets: handleModule(DatasetsProvider),
  myGfw: handleModule(MyGFWProvider),
  ptw: handleModule(PTWProvider),
  layerSpec: handleModule(LayerSpecProvider)
};

// Page Reducers
const pageReducers = {
  dashboards: handleModule(DashboardsPage),
  mapPage: handleModule(MapPage)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  ...pageReducers,
  form: formReducer,
  location: router.reducer
});
