import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';

import { getTileGeoJSON } from './components/recent-imagery/recent-imagery-selectors';

import initialState from './initial-state';

// get list data
const getMapUrlState = state =>
  (state.location && state.location.query && state.location.query.map) || null;
const getDatasets = state => state.datasets.datasets;
const getLoading = state => state.datasets.loading || state.geostore.loading;
const getGeostore = state => state.geostore.geostore || null;
const getQuery = state => (state.location && state.location.query) || null;
const selectLocation = state =>
  (state.location && state.location.payload) || null;
// analysis selects
const selectAnalysisSettings = state =>
  state.location && state.location.query && state.location.query.analysis;

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

export const getDraw = createSelector(
  getMapSettings,
  settings => settings.draw
);

export const getBbox = createSelector(
  getMapSettings,
  settings => settings.bbox
);

export const getCanBound = createSelector(
  getMapSettings,
  settings => settings.canBound
);

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
    name: d.name,
    dataset: d.id,
    layer: d.layer,
    id: d.id,
    label: d.name,
    value: d.layer
  }));
});

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
        opacity,
        bbox
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
            bbox,
            color: d.color,
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
export const getAllLayers = createSelector(getLayerGroups, layerGroups => {
  if (isEmpty(layerGroups)) return null;
  return flatten(layerGroups.map(d => d.layers))
    .filter(l => l.active)
    .map((l, i) => ({
      ...l,
      zIndex:
        l.interactionConfig && l.interactionConfig.article ? 1100 + i : 1000 - i
    }));
});

// flatten datasets into layers for the layer manager
export const getActiveLayers = createSelector(getAllLayers, layers => {
  if (isEmpty(layers)) return [];
  return layers.filter(l => !l.confirmedOnly);
});

export const getLayerBbox = createSelector([getActiveLayers], layers => {
  const layerWithBbox =
    layers && layers.find(l => l.bbox || (l.layerConfig && l.layerConfig.bbox));
  const layerBbox =
    layerWithBbox &&
    (layerWithBbox.bbox ||
      (layerWithBbox.layerConfig && layerWithBbox.layerConfig.bbox));
  return layerBbox;
});

export const getGeostoreBbox = createSelector(
  [getGeostore],
  geostore => geostore && geostore.bbox
);

// analysis
export const getShowAnalysis = createSelector(
  getQuery,
  query => query && query.analysis && query.analysis.showAnalysis
);

export const getOneClickAnalysisActive = createSelector(
  [selectAnalysisSettings, selectLocation, getDraw],
  (settings, location, draw) =>
    settings &&
    !draw &&
    settings.showAnalysis &&
    !settings.showDraw &&
    !location.country
);

export const getMapProps = createStructuredSelector({
  activeDatasets: getActiveDatasets,
  settings: getMapSettings,
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabels,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers,
  loading: getLoading,
  layerBbox: getLayerBbox,
  geostoreBbox: getGeostoreBbox,
  bbox: getBbox,
  canBound: getCanBound,
  geostore: getGeostore,
  tileGeoJSON: getTileGeoJSON,
  query: getQuery,
  location: selectLocation,
  draw: getDraw,
  analysisActive: getShowAnalysis,
  oneClickAnalysisActive: getOneClickAnalysisActive
});
