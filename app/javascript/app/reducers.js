/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';
import { reducer as formReducer } from 'redux-form';

// Routes
import router from './router';

// COMPONENTS

// Map & Dashboards
import { reduxModule as RecentImagery } from 'components/map-v2/components/recent-imagery';
import { reduxModule as DataAnalysisMenu } from 'pages/map/components/data-analysis-menu';
import { reduxModule as Widgets } from 'components/widgets';
import { reduxModule as Popup } from 'components/map-v2/components/popup';
import { reduxModule as Header } from 'pages/dashboards/header';
import { reduxModule as MapOld } from 'components/map';

// Projects (About and SGF)
import { reduxModule as Impacts } from 'pages/about/section-impacts';
import { reduxModule as AboutProjects } from 'pages/about/section-projects';
import { reduxModule as SGFProjects } from 'pages/sgf/section-projects';

// Modals
import { reduxModule as ModalMeta } from 'components/modals/meta';
import { reduxModule as Share } from 'components/modals/share';
import { reduxModule as ModalVideo } from 'components/modals/video';
import { reduxModule as AboutModal } from 'pages/about/section-projects/section-projects-modal';
import { reduxModule as SGFModal } from 'pages/sgf/section-projects/section-projects-modal';

// Forms
import { reduxModule as Contact } from 'pages/about/section-contact';

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

// Component Reducers
const componentsReducers = {
  // map & dashboards
  analysis: handleModule(DataAnalysisMenu),
  recentImagery: handleModule(RecentImagery),
  widgets: handleModule(Widgets),
  popup: handleModule(Popup),
  header: handleModule(Header),
  share: handleModule(Share),
  map: handleModule(MapOld),
  // modals
  modalVideo: handleModule(ModalVideo),
  modalMeta: handleModule(ModalMeta),
  modalAbout: handleModule(AboutModal),
  modalSGF: handleModule(SGFModal),
  // projects
  impacts: handleModule(Impacts),
  aboutProjects: handleModule(AboutProjects),
  sgfProjects: handleModule(SGFProjects),
  // forms
  contact: handleModule(Contact)
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
  dashboards: handleModule(DashboardsPage)
};

export default combineReducers({
  ...providersReducers,
  ...componentsReducers,
  ...pageReducers,
  form: formReducer,
  location: router.reducer
});
