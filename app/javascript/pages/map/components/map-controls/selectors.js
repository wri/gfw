import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getRecentImageryDataset
} from 'components/recent-imagery/selectors';
import {
  getMapViewport,
  getActiveDatasetsFromState,
  getMapMinZoom,
  getMapMaxZoom,
  getBasemap
} from 'components/map/selectors';
import {
  getHidePanels,
  getShowBasemaps,
  getShowRecentImagery
} from 'layouts/map/selectors';

const getDatasetsLoading = state => state.datasets && state.datasets.loading;
const getMapTourOpen = state => state.mapTour && state.mapTour.open;

export default createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  datasetsLoading: getDatasetsLoading,
  hidePanels: getHidePanels,
  viewport: getMapViewport,
  datasets: getActiveDatasetsFromState,
  minZoom: getMapMinZoom,
  maxZoom: getMapMaxZoom,
  showBasemaps: getShowBasemaps,
  activeBasemap: getBasemap,
  showRecentImagery: getShowRecentImagery,
  recentSettings: getRecentImagerySettings,
  recentImageryDataset: getRecentImageryDataset,
  mapTourOpen: getMapTourOpen
});
