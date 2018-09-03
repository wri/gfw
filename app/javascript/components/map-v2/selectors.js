import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';

import initialState from './initial-state';

// get list data
const getMapUrlState = state => (state.query && state.query.map) || null;
const getDatasets = state => state.datasets;
const getLoading = state => state.loading;
const getGeostore = state => state.geostore || null;

// get all map settings
export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...initialState,
  ...urlState
}));

// get single map settings
export const getBasemap = createSelector(
  getMapSettings,
  settings => settings.basemap
);

export const getMapZoom = createSelector(
  getMapSettings,
  settings => settings.zoom
);

export const getLabels = createSelector(
  getMapSettings,
  settings => settings.label
);

export const getBBox = createSelector(getGeostore, geostore => {
  const { bbox } = geostore;
  if (isEmpty(bbox)) return {};
  return { bbox, options: { padding: [10, 10] } };
});

export const getMapOptions = createSelector(getMapSettings, settings => {
  if (!settings) return null;
  const {
    center,
    zoom,
    minZoom,
    maxZoom,
    zoomControl,
    basemap,
    label,
    attributionControl
  } = settings;
  return {
    center,
    zoom,
    minZoom,
    maxZoom,
    zoomControl,
    label,
    basemap,
    attributionControl
  };
});

// select datasets and dataset state
export const getActiveDatasetsState = createSelector(
  getMapSettings,
  settings => settings.datasets
);

export const getActiveDatasetIds = createSelector(
  [getActiveDatasetsState],
  activeDatasetsState => {
    if (!activeDatasetsState || !activeDatasetsState.length) return null;
    return activeDatasetsState.map(l => l.dataset);
  }
);

export const getActiveDatasets = createSelector(
  [getDatasets, getActiveDatasetIds],
  (datasets, datasetIds) => {
    if (isEmpty(datasets) || isEmpty(datasetIds)) return null;
    return datasets.filter(d => datasetIds.includes(d.id));
  }
);

export const getBoundaryDatasets = createSelector([getDatasets], datasets => {
  if (isEmpty(datasets)) return null;
  return datasets.filter(d => d.isBoundary).map(d => ({
    ...d,
    label: d.name,
    value: d.layer
  }));
});

export const getActiveBoundaryDatasets = createSelector(
  [getBoundaryDatasets, getActiveDatasets],
  (datasets, activeDatasets) => {
    if (isEmpty(datasets) || isEmpty(activeDatasets)) return null;
    const datasetIds = activeDatasets.map(d => d.dataset);
    return datasets.find(d => datasetIds.includes(d.dataset));
  }
);

// parse active datasets to add config from url
export const getDatasetsWithConfig = createSelector(
  [getActiveDatasets, getActiveDatasetsState],
  (datasets, activeDatasetsState) => {
    if (isEmpty(datasets) || isEmpty(activeDatasetsState)) return null;

    return datasets.map(d => {
      const layerConfig =
        activeDatasetsState.find(l => l.dataset === d.id) || {};
      const {
        params,
        sqlParams,
        decodeParams,
        timelineParams,
        layers,
        visibility,
        opacity
      } =
        layerConfig || {};

      return {
        ...d,
        ...layerConfig,
        ...(d.selectorLayerConfig && {
          selectorLayerConfig: {
            ...d.selectorLayerConfig,
            selected: d.selectorLayerConfig.options.find(
              l => l.value === layers[0]
            )
          }
        }),
        layers: d.layers.map(l => {
          const { hasParamsTimeline, hasDecodeTimeline } = l;

          return {
            ...l,
            visibility,
            opacity,
            active: layers && layers.includes(l.id),
            ...(!isEmpty(l.params) && {
              params: {
                ...l.params,
                ...params,
                ...(hasParamsTimeline && {
                  ...timelineParams
                })
              }
            }),
            ...(!isEmpty(l.sqlParams) && {
              sqlParams: {
                ...l.sqlParams,
                ...sqlParams
              }
            }),
            ...(!isEmpty(l.decodeParams) &&
              l.decodeFunction && {
                decodeParams: {
                  ...l.decodeParams,
                  ...(layers &&
                    layers.includes('confirmedOnly') && {
                      confirmedOnly: true
                    }),
                  ...decodeParams,
                  ...(hasDecodeTimeline && {
                    ...timelineParams
                  })
                }
              }),
            ...((l.hasParamsTimeline || l.hasDecodeTimeline) && {
              timelineConfig: {
                ...(l.hasParamsTimeline && {
                  ...l.params
                }),
                ...(l.hasDecodeTimeline && {
                  ...l.decodeParams
                }),
                ...timelineParams
              }
            })
          };
        })
      };
    });
  }
);

// map active datasets into correct order based on url state (drag and drop)
export const getLayerGroups = createSelector(
  [getDatasetsWithConfig, getActiveDatasetsState],
  (datasets, activeDatasetsState) => {
    if (isEmpty(datasets) || isEmpty(activeDatasetsState)) return null;
    return activeDatasetsState.map(l => datasets.find(d => d.id === l.dataset));
  }
);

// filter out any boundary layers that are for the basemaps comp
export const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary && !g.isRecentImagery);
});

// flatten datasets into layers for the layer manager
export const getActiveLayers = createSelector(getLayerGroups, layerGroups => {
  if (isEmpty(layerGroups)) return [];
  return flatten(layerGroups.map(d => d.layers))
    .filter(l => l.active && !l.confirmedOnly)
    .map((l, i) => ({
      ...l,
      zIndex:
        l.interactionConfig && l.interactionConfig.article ? 1100 + i : 1000 - i
    }));
});

export const getMapProps = createStructuredSelector({
  activeDatasets: getActiveDatasets,
  settings: getMapSettings,
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabels,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers,
  loading: getLoading,
  bbox: getBBox
});
