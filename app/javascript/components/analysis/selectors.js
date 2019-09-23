import { createSelector, createStructuredSelector } from 'reselect';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';

import { getAllLayers, getActiveDatasets } from 'components/map/selectors';
import { getActiveArea } from 'providers/areas-provider/selectors';
import { locationLevelToStr } from 'utils/format';
import { getWidgets } from 'components/widgets/selectors';

import { initialState } from './reducers';

const selectAnalysisUrlState = state =>
  state.location && state.location.query && state.location.query.analysis;
const selectAnalysisLoading = state => state.analysis && state.analysis.loading;
const selectDatasetsLoading = state => state.datasets && state.datasets.loading;
const selectGeostoreLoading = state => state.geostore && state.geostore.loading;
const selectGeodecriberLoading = state =>
  state.geodescriber && state.geodescriber.loading;
const selectLocation = state => state.location && state.location.payload;
const selectSearch = state => state.location && state.location.search;
const selectAnalysisLocation = state =>
  state.analysis && state.analysis.location;
const selectEmbed = state =>
  state.location &&
  state.location.pathname &&
  state.location.pathname.includes('/embed');
const selectError = state => state.analysis && state.analysis.error;
const selectDatasets = state => state.datasets && state.datasets.data;

export const getLoading = createSelector(
  [
    selectAnalysisLoading,
    selectDatasetsLoading,
    selectGeostoreLoading,
    selectGeodecriberLoading
  ],
  (analysisLoading, datasetsLoading, geostoreLoading, geodescriberLoading) =>
    analysisLoading || datasetsLoading || geostoreLoading || geodescriberLoading
);

export const getAnalysisSettings = createSelector(
  [selectAnalysisUrlState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getShowDraw = createSelector(
  getAnalysisSettings,
  settings => settings.showDraw
);

export const getBoundaryDatasets = createSelector(
  [selectDatasets],
  datasets => {
    if (isEmpty(datasets)) return null;
    return datasets.filter(d => d.isBoundary).map(d => ({
      name: d.name,
      dataset: d.id,
      layers: d.layers.map(l => l.id),
      id: d.id,
      label: d.name,
      value: d.layer
    }));
  }
);

export const getAllBoundaries = createSelector(
  [getBoundaryDatasets],
  boundaries =>
    [{ label: 'No boundaries', value: 'no-boundaries' }].concat(boundaries)
);

export const getActiveBoundaryDatasets = createSelector(
  [getBoundaryDatasets, getActiveDatasets],
  (datasets, activeDatasets) => {
    if (isEmpty(datasets) || isEmpty(activeDatasets)) return null;
    const datasetIds = activeDatasets.map(d => d.dataset);
    return datasets.find(d => datasetIds.includes(d.dataset));
  }
);

export const getWidgetLayers = createSelector(
  [getWidgets],
  widgets =>
    widgets &&
    flatMap(
      widgets.map(w =>
        flatMap(
          w.datasets.map(
            d => (Array.isArray(d.layers) ? d.layers : Object.values(d.layers))
          )
        )
      )
    )
);

export const parseLocation = createSelector(
  [getActiveArea, selectLocation],
  (activeArea, location) =>
    (location.type === 'aoi' && activeArea
      ? {
        ...location,
        type: 'geostore',
        adm0: activeArea.geostore
      }
      : location)
);

export const getLayerEndpoints = createSelector(
  [getAllLayers, parseLocation, getWidgetLayers],
  (layers, location, widgetLayers) => {
    if (!layers || !layers.length) return null;

    const { type, adm2 } = location;
    const routeType = type === 'country' ? 'admin' : type;
    const lossLayer = layers.find(l => l.metadata === 'tree_cover_loss');
    const hasWidgetLayers = widgetLayers && !!widgetLayers.length;

    const admLevel = locationLevelToStr(location);
    const endpoints = compact(
      layers
        .filter(
          l =>
            l.analysisConfig &&
            !l.analysisDisabled &&
            (!hasWidgetLayers || !widgetLayers.includes(l.id)) &&
            (!l.admLevels || l.admLevels.includes(admLevel))
        )
        .map(l => {
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
    const parsedEndpoints = Object.keys(groupedEndpoints)
      .filter(slug => slug !== 'undefined')
      .map(slug => {
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

export const getAnalysisProps = createStructuredSelector({
  loading: getLoading,
  error: selectError,
  embed: selectEmbed,
  location: parseLocation,
  endpoints: getLayerEndpoints,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  widgetLayers: getWidgetLayers,
  analysisLocation: selectAnalysisLocation,
  activeArea: getActiveArea,
  search: selectSearch
});
