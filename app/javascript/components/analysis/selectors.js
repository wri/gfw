import { createSelector, createStructuredSelector } from 'reselect';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';

import { getAllLayers, getActiveDatasets } from 'components/map/selectors';
import { parseWidgetsWithOptions } from 'components/widgets/selectors';
import { locationLevelToStr } from 'utils/format';

import { initialState } from './reducers';

const selectAnalysisUrlState = state =>
  state.location && state.location.query && state.location.query.analysis;
const selectAnalysisLoading = state => state.analysis && state.analysis.loading;
const selectDatasetsLoading = state => state.datasets && state.datasets.loading;
const selectGeostoreLoading = state => state.geostore && state.geostore.loading;
const selectLocation = state => state.location && state.location.payload;
const selectAnalysisLocation = state =>
  state.analysis && state.analysis.location;
const selectEmbed = state =>
  state.location &&
  state.location.pathname &&
  state.location.pathname.includes('/embed');
const selectError = state => state.analysis && state.analysis.error;
const selectDatasets = state => state.datasets && state.datasets.data;

export const getLoading = createSelector(
  [selectAnalysisLoading, selectDatasetsLoading, selectGeostoreLoading],
  (analysisLoading, datasetsLoading, geostoreLoading) =>
    analysisLoading || datasetsLoading || geostoreLoading
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
  parseWidgetsWithOptions,
  widgets => {
    const activeWidgets =
      widgets &&
      widgets.filter(
        w => w.config.analysis && w.config.datasets && w.config.datasets.length
      );
    return (
      activeWidgets &&
      flatMap(
        activeWidgets.map(w =>
          flatMap(
            w.config.datasets.map(
              d =>
                (Array.isArray(d.layers) ? d.layers : Object.values(d.layers))
            )
          )
        )
      )
    );
  }
);

export const getLayerEndpoints = createSelector(
  [getAllLayers, selectLocation, getWidgetLayers],
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
  location: selectLocation,
  endpoints: getLayerEndpoints,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  widgetLayers: getWidgetLayers,
  analysisLocation: selectAnalysisLocation
});
