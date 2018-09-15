import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveSection } from 'pages/map/components/menu/menu-selectors';
import {
  getAllBoundaries,
  getActiveBoundaryDatasets
} from 'components/map-v2/selectors';

import layersIcon from 'assets/icons/layers.svg';
import analysisIcon from 'assets/icons/analysis.svg';

import { initialState } from './reducers';

const selectAnalysisUrlState = state =>
  (state.location.query && state.location.query.analysis) || null;
const selectLoading = state =>
  state.analysis.loading ||
  state.datasets.loading ||
  state.geostore.loading ||
  state.draw.loading;
const selectLoadingAnalysis = state => state.analysis.loading;
const selectLocation = state => state.location && state.location.payload;
const selectQuery = state => state.location && state.location.query;
export const selectDrawPolygon = state => state.draw.geostoreId;

export const getAnalysisSettings = createSelector(
  [selectAnalysisUrlState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getShowAnalysis = createSelector(
  getAnalysisSettings,
  settings => settings.showAnalysis
);

export const getShowDraw = createSelector(
  getAnalysisSettings,
  settings => settings.showDraw
);

export const getMenuLinks = createSelector([getShowAnalysis], showAnalysis => [
  {
    label: 'DATA',
    icon: layersIcon,
    active: !showAnalysis,
    showAnalysis: false
  },
  {
    label: 'ANALYSIS',
    icon: analysisIcon,
    active: showAnalysis,
    showAnalysis: true
  }
]);

export const getAnalysisProps = createStructuredSelector({
  settings: getAnalysisSettings,
  showAnalysis: getShowAnalysis,
  showDraw: getShowDraw,
  menuSection: getActiveSection,
  loading: selectLoading,
  fetchingAnalysis: selectLoadingAnalysis,
  links: getMenuLinks,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  location: selectLocation,
  query: selectQuery,
  drawnGeostoreId: selectDrawPolygon
});
