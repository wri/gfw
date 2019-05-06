import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getRecentImageryDataset
} from 'components/recent-imagery/selectors';
import { getMapSettings } from 'components/map/selectors';
import {
  getHidePanels,
  getShowBasemaps,
  getShowRecentImagery
} from 'pages/map/selectors';

const getDatasetsLoading = state => state.datasets && state.datasets.loading;
const getMapTourOpen = state => state.mapTour && state.mapTour.open;

export const getMapControlsProps = createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  datasetsLoading: getDatasetsLoading,
  hidePanels: getHidePanels,
  mapSettings: getMapSettings,
  showBasemaps: getShowBasemaps,
  showRecentImagery: getShowRecentImagery,
  recentSettings: getRecentImagerySettings,
  recentImageryDataset: getRecentImageryDataset,
  mapTourOpen: getMapTourOpen
});
