import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getMapSettings,
  getActive,
  getRecentImageryDataset
} from 'components/maps/main-map/components/recent-imagery/recent-imagery-selectors';
import {
  getHidePanels,
  getShowBasemaps
} from 'components/maps/main-map/selectors';

const getDatasetsLoading = state => state.datasets && state.datasets.loading;
const getMapTourOpen = state => state.mapTour && state.mapTour.open;

export const getMapControlsProps = createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  datasetsLoading: getDatasetsLoading,
  hidePanels: getHidePanels,
  mapSettings: getMapSettings,
  showBasemaps: getShowBasemaps,
  recentSettings: getRecentImagerySettings,
  recentActive: getActive,
  recentImageryDataset: getRecentImageryDataset,
  mapTourOpen: getMapTourOpen
});
