import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getMapSettings,
  getActive,
  getRecentImageryDataset
} from 'components/map-v2/components/recent-imagery/recent-imagery-selectors';

const getDatasetsLoading = state => state.datasets.loading;
const getMapTourOpen = state => state.mapTour.open;

export const getMapControlsProps = createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  datasetsLoading: getDatasetsLoading,
  settings: getMapSettings,
  recentSettings: getRecentImagerySettings,
  recentActive: getActive,
  recentImageryDataset: getRecentImageryDataset,
  mapTourOpen: getMapTourOpen
});
