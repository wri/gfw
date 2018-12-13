import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';

import { initialState } from './reducers';
import basemaps, { labels } from './basemaps-schema';

// map state
const selectMapUrlState = state =>
  state.location && state.location.query && state.location.query.map;
const selectMapLoading = state => state.map.loading;
const selectGeostoreLoading = state => state.geostore.loading;
const selectLatestLoading = state => state.latest.loading;
const selectDatasetsLoading = state => state.datasets.loading;

// datasets
const selectDatasets = state => state.datasets.data;
const selectLatest = state => state.latest.data;

// location
const selectGeostore = state => state.geostore.data || null;

// interactions
const selectSelectedInteractionId = state => state.popup.selected;
const selectInteractions = state => state.popup.interactions;

// get widgets
const selectWidgetActiveSettings = state => state.widgets.settings;

// CONSTS
export const getBasemaps = () => basemaps;
export const getLabels = () => labels;

// SELECTORS
export const getMapSettings = createSelector([selectMapUrlState], urlState => ({
  ...initialState.settings,
  ...urlState
}));

export const getBasemapFromState = createSelector(
  getMapSettings,
  settings => settings.basemap
);

export const getBasemap = createSelector(
  [getBasemapFromState],
  basemapState => ({
    ...basemaps[basemapState.value],
    ...basemapState
  })
);

export const getLabelKey = createSelector(
  getMapSettings,
  settings => settings.label
);

export const getLabel = createSelector(
  [getLabelKey],
  labelsKey => labels[labelsKey] || labels[labelsKey.id]
);

export const getMapZoom = createSelector(
  getMapSettings,
  settings => settings.zoom
);

export const getDraw = createSelector(
  [getMapSettings],
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

export const getMapOptions = createSelector(
  [getMapSettings, getBasemap, getLabel],
  (settings, basemap, label) => {
    if (!settings) return null;
    const {
      center,
      zoom,
      minZoom,
      maxZoom,
      zoomControl,
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
  }
);

export const getMapLoading = createSelector(
  [
    selectMapLoading,
    selectGeostoreLoading,
    selectLatestLoading,
    selectDatasetsLoading
  ],
  (mapLoading, geostoreLoading, latestLoading, datasetsLoading) =>
    mapLoading || geostoreLoading || latestLoading || datasetsLoading
);

// select datasets and dataset state
export const getActiveDatasetsFromState = createSelector(
  getMapSettings,
  settings => settings.datasets
);

export const getActiveDatasetIds = createSelector(
  [getActiveDatasetsFromState],
  activeDatasetsState => {
    if (!activeDatasetsState || !activeDatasetsState.length) return null;
    return activeDatasetsState.map(l => l.dataset);
  }
);

export const getActiveDatasets = createSelector(
  [selectDatasets, getActiveDatasetIds],
  (datasets, datasetIds) => {
    if (isEmpty(datasets) || isEmpty(datasetIds)) return null;
    return datasets.filter(d => datasetIds.includes(d.id));
  }
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

// parse active datasets to add config from url
export const getDatasetsWithConfig = createSelector(
  [getActiveDatasets, getActiveDatasetsFromState, selectLatest],
  (datasets, activeDatasetsState, latestDates) => {
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
          const {
            hasParamsTimeline,
            hasDecodeTimeline,
            timelineConfig,
            id
          } = l;
          const maxDate = latestDates[id];

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
                ...(maxDate && {
                  endDate: maxDate
                }),
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
            ...(l.decodeFunction && {
              decodeParams: {
                ...l.decodeParams,
                ...(layers &&
                  layers.includes('confirmedOnly') && {
                    confirmedOnly: true
                  }),
                ...(maxDate && {
                  endDate: maxDate
                }),
                ...decodeParams,
                ...(hasDecodeTimeline && {
                  ...timelineParams
                })
              }
            }),
            ...((l.hasParamsTimeline || l.hasDecodeTimeline) && {
              timelineConfig: {
                ...timelineConfig,
                ...(l.hasParamsTimeline && {
                  ...l.params
                }),
                ...(l.hasDecodeTimeline && {
                  ...l.decodeParams
                }),
                ...(maxDate && {
                  endDate: maxDate,
                  maxDate,
                  trimEndDate: maxDate
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
  [getDatasetsWithConfig, getActiveDatasetsFromState],
  (datasets, activeDatasetsState) => {
    if (isEmpty(datasets) || isEmpty(activeDatasetsState)) return null;

    return activeDatasetsState
      .map(l => datasets.find(d => d.id === l.dataset))
      .filter(l => l)
      .map(d => {
        const { metadata } = (d && d.layers.find(l => l.active)) || {};
        return {
          ...d,
          metadata: metadata || d.metadata
        };
      });
  }
);

// flatten datasets into layers for the layer manager
export const getAllLayers = createSelector(getLayerGroups, layerGroups => {
  if (isEmpty(layerGroups)) return null;

  return flatten(layerGroups.map(d => d.layers))
    .filter(l => l.active && (!l.isRecentImagery || l.params.url))
    .map((l, i) => {
      let zIndex =
        l.interactionConfig && l.interactionConfig.article
          ? 1100 + i
          : 1000 - i;
      if (l.isRecentImagery) zIndex = 500;
      if (l.isBoundary) zIndex = 1050 - i;
      return {
        ...l,
        zIndex
      };
    });
});

// all layers for importing by other components
export const getActiveLayers = createSelector(getAllLayers, layers => {
  if (isEmpty(layers)) return [];
  return layers.filter(l => !l.confirmedOnly);
});

// flatten datasets into layers for the layer manager
export const getActiveLayersWithWidgetSettings = createSelector(
  [getAllLayers, selectWidgetActiveSettings],
  (layers, widgetSettings) => {
    if (isEmpty(layers)) return [];
    if (isEmpty(widgetSettings)) return layers;
    return layers.map(l => {
      const layerWidgetState =
        widgetSettings &&
        Object.values(widgetSettings).find(
          w => w.layers && w.layers.includes(l.id)
        );
      const { updateLayer } = layerWidgetState || {};
      return {
        ...l,
        ...(l.decodeParams &&
          updateLayer && {
            decodeParams: {
              ...l.decodeParams,
              ...layerWidgetState
            }
          }),
        ...(l.params &&
          updateLayer && {
            params: {
              ...l.params,
              ...layerWidgetState
            }
          })
      };
    });
  }
);

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
  [selectGeostore],
  geostore => geostore && geostore.bbox
);

export const filterInteractions = createSelector(
  [selectInteractions],
  interactions => {
    if (isEmpty(interactions)) return null;
    return Object.values(interactions)
      .filter(i => !isEmpty(i.data))
      .map(i => ({
        ...i
      }));
  }
);

export const getSelectedInteraction = createSelector(
  [filterInteractions, selectSelectedInteractionId, getActiveLayers],
  (options, selected, layers) => {
    if (isEmpty(options)) return null;
    const layersWithoutBoundaries = layers.filter(
      l => !l.isBoundary && !isEmpty(l.interactionConfig)
    );
    // if there is an article (icon layer) then choose that
    let selectedData = options.find(o => o.article);
    // if there is nothing selected get the top layer
    if (!selected && !!layersWithoutBoundaries.length) {
      selectedData = options.find(
        o => o.value === layersWithoutBoundaries[0].id
      );
    }
    // if only one layer then get that
    if (!selectedData && options.length === 1) selectedData = options[0];
    // otherwise get based on selected
    if (!selectedData) selectedData = options.find(o => o.value === selected);
    const layer =
      selectedData && layers && layers.find(l => l.id === selectedData.id);

    return { ...selectedData, layer };
  }
);

export const getMapProps = createStructuredSelector({
  loading: getMapLoading,
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabel,
  layerBbox: getLayerBbox,
  geostoreBbox: getGeostoreBbox,
  bbox: getBbox,
  canBound: getCanBound,
  draw: getDraw,
  selectedInteraction: getSelectedInteraction
});
