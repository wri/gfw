import { createSelector, createStructuredSelector } from 'reselect';
import compact from 'lodash/compact';
import uniqBy from 'lodash/uniqBy';

import { getActiveSection } from 'pages/map/components/menu/menu-selectors';
import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getActiveLayers
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
const selectError = state => state.analysis.error;
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

export const getLayerEndpoints = createSelector(
  [getActiveLayers, selectLocation],
  (layers, location) => {
    if (!layers || !layers.length) return null;
    const { type } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const lossLayer = layers.find(l => l.metadata === 'tree_cover_loss');

    return uniqBy(
      compact(
        layers.filter(l => l.analysisConfig).map(l => {
          const analysisConfig = l.analysisConfig.find(
            a => a.type === routeType || a.type === 'geostore'
          );
          const { params, decodeParams } = l;
          return {
            slug: analysisConfig.service,
            params: {
              ...(analysisConfig.service === 'umd-loss-gain' &&
                lossLayer && {
                  ...lossLayer.decodeParams
                }),
              ...params,
              ...decodeParams
            }
          };
        })
      ),
      'slug'
    );
  }
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
  endpoints: getLayerEndpoints,
  loading: selectLoading,
  error: selectError,
  fetchingAnalysis: selectLoadingAnalysis,
  links: getMenuLinks,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  location: selectLocation,
  query: selectQuery,
  drawnGeostoreId: selectDrawPolygon
});
