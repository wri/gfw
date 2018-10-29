import { createSelector, createStructuredSelector } from 'reselect';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';

import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getAllLayers
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
const selectLocation = state => state.location && state.location.payload;
const selectEmbed = state =>
  state.location &&
  state.location.pathname &&
  state.location.pathname.includes('/embed');
const selectError = state => state.analysis.error;

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

export const getHidden = createSelector(
  getAnalysisSettings,
  settings => settings.hidden
);

export const getShowDraw = createSelector(
  getAnalysisSettings,
  settings => settings.showDraw
);

export const getLayerEndpoints = createSelector(
  [getAllLayers, selectLocation],
  (layers, location) => {
    if (!layers || !layers.length) return null;
    const { type, adm2 } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const lossLayer = layers.find(l => l.metadata === 'tree_cover_loss');

    const endpoints = compact(
      layers.filter(l => l.analysisConfig).map(l => {
        const analysisConfig =
          l.analysisConfig.find(
            a =>
              a.type === routeType ||
              ((routeType === 'use' || routeType === 'wdpa') &&
                a.type === 'geostore')
          ) || {};
        const { params, decodeParams } = l;

        return {
          name: l.name,
          version: analysisConfig.version || 'v1',
          slug: analysisConfig.service,
          params: {
            ...(analysisConfig.service === 'umd-loss-gain' &&
              lossLayer && {
                ...lossLayer.decodeParams
              }),
            ...decodeParams,
            ...params,
            query: analysisConfig.query
          }
        };
      })
    );

    const groupedEndpoints = groupBy(endpoints, 'slug');
    const parsedEndpoints = Object.keys(groupedEndpoints).map(slug => {
      let params = {};
      groupedEndpoints[slug].forEach(e => {
        params = {
          ...params,
          ...e.params
        };
      });

      return {
        slug,
        params,
        version: groupedEndpoints[slug][0].version,
        name: groupedEndpoints[slug][0].name
      };
    });

    return adm2
      ? parsedEndpoints.filter(e => !e.slug.includes('forma'))
      : parsedEndpoints;
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
  showAnalysis: getShowAnalysis,
  endpoints: getLayerEndpoints,
  loading: selectLoading,
  error: selectError,
  links: getMenuLinks,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  location: selectLocation,
  hidden: getHidden,
  embed: selectEmbed
});
