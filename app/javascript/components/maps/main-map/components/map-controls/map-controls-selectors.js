import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getMapSettings,
  getRecentImageryDataset
} from 'components/maps/main-map/components/recent-imagery/recent-imagery-selectors';
import {
  getHidePanels,
  getShowBasemaps,
  getShowRecentImagery
} from 'components/maps/main-map/selectors';
import { getBasemap } from 'components/maps/map/selectors';

const getDatasetsLoading = state => state.datasets && state.datasets.loading;
const getMapTourOpen = state => state.mapTour && state.mapTour.open;

export const getMapControlsProps = createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  datasetsLoading: getDatasetsLoading,
  hidePanels: getHidePanels,
  mapSettings: getMapSettings,
  showBasemaps: getShowBasemaps,
  activeBasemap: getBasemap,
  showRecentImagery: getShowRecentImagery,
  recentSettings: getRecentImagerySettings,
  recentImageryDataset: getRecentImageryDataset,
  mapTourOpen: getMapTourOpen
});
