import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';
import { getDayRange } from 'utils/dates';

import { initialState } from './reducers';
import basemaps from './basemaps';

// map state
const selectMapUrlState = state =>
  state.location && state.location.query && state.location.query.map;
const selectMapLoading = state => state.map && state.map.loading;
const selectGeostoreLoading = state => state.geostore && state.geostore.loading;
const selectLatestLoading = state => state.latest && state.latest.loading;
const selectDatasetsLoading = state => state.datasets && state.datasets.loading;
const selectRecentImageryLoading = state =>
  state.recentImagery && state.recentImagery.loading;
const selectMapData = state => state.map && state.map.data;
const selectDatasets = state => state.datasets && state.datasets.data;
const selectLatest = state => state.latest && state.latest.data;
export const selectGeostore = state => state.geostore && state.geostore.data;

// CONSTS
export const getBasemaps = () => basemaps;

// SELECTORS
export const getMapSettings = createSelector([selectMapUrlState], urlState => ({
  ...initialState.settings,
  ...urlState
}));

export const getMapViewport = createSelector([getMapSettings], settings => {
  const { zoom, bearing, pitch, center } = settings;
  return {
    zoom,
    bearing,
    pitch,
    latitude: center.lat,
    longitude: center.lng
  };
});

export const getMapZoom = createSelector(
  [getMapSettings],
  settings => settings.zoom
);

export const getMapMinZoom = createSelector(
  [getMapSettings],
  settings => settings.minZoom
);

export const getMapMaxZoom = createSelector(
  [getMapSettings],
  settings => settings.maxZoom
);

export const getBasemapFromState = createSelector(
  getMapSettings,
  settings => settings.basemap
);

export const getBasemap = createSelector(
  [getBasemapFromState],
  basemapState => {
    const basemap = {
      ...basemaps[basemapState.value],
      ...basemapState
    };
    let url = basemap && basemap.url;
    if (url) {
      Object.keys(basemap).forEach(key => {
        if (url.includes(`{${key}}`)) {
          url = url.replace(`{${key}}`, basemap[key]);
        }
      });
    }

    return { ...basemap, url };
  }
);

export const getMapStyle = createSelector(
  getBasemap,
  basemap => basemap.mapStyle
);

export const getMapLabels = createSelector(
  getMapSettings,
  settings => settings.labels
);

export const getMapRoads = createSelector(
  getMapSettings,
  settings => settings.roads
);

export const getDrawing = createSelector(
  [getMapSettings],
  settings => settings.drawing
);

export const getCanBound = createSelector(
  getMapSettings,
  settings => settings.canBound
);

export const getGeostoreBbox = createSelector(
  [selectGeostore],
  geostore => geostore && geostore.bbox
);

export const getStateBbox = createSelector(
  [getMapSettings],
  settings => settings && settings.bbox
);

export const getMapLoading = createSelector(
  [
    selectMapLoading,
    selectGeostoreLoading,
    selectLatestLoading,
    selectDatasetsLoading,
    selectRecentImageryLoading
  ],
  (
    mapLoading,
    geostoreLoading,
    latestLoading,
    datasetsLoading,
    recentLoading
  ) =>
    mapLoading ||
    geostoreLoading ||
    latestLoading ||
    datasetsLoading ||
    recentLoading
);

export const getLoadingMessage = createSelector(
  [selectRecentImageryLoading, selectLatestLoading],
  (recentLoading, latestLoading) => {
    if (recentLoading) return 'Fetching the most recent satellite image...';
    if (latestLoading) return 'Fetching latest data...';
    return '';
  }
);

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
          const { latestFormat } = l.params || {};
          const maxDateFormatted = latestFormat
            ? moment(maxDate).format(latestFormat)
            : maxDate;

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
                ...(maxDateFormatted && {
                  date: maxDateFormatted
                }),
                ...(hasParamsTimeline && {
                  ...timelineParams
                }),
                ...(maxDate && {
                  maxDate
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
                ...(layers && {
                  confirmedOnly: layers.includes('confirmedOnly') ? 1 : 0
                }),
                ...(maxDate && {
                  endDate: maxDate
                }),
                ...decodeParams,
                ...(hasDecodeTimeline && {
                  ...timelineParams
                }),
                ...(maxDate && {
                  maxDate
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

    return activeDatasetsState.map(layer => {
      const dataset = datasets.find(d => d.id === layer.dataset);
      const { metadata } =
        (dataset && dataset.layers.find(l => l.active)) || {};
      return {
        ...dataset,
        metadata: metadata || dataset.metadata
      };
    });
  }
);

// flatten datasets into layers for the layer manager
export const getAllLayers = createSelector(getLayerGroups, layerGroups => {
  if (isEmpty(layerGroups)) return null;

  return sortBy(
    flatten(layerGroups.map(d => d.layers))
      .filter(l => l.active && (!l.isRecentImagery || l.params.url))
      .map((l, i) => {
        let zIndex = 1000 - i;
        if (l.isRecentImagery) zIndex = 500;
        if (l.isBoundary) zIndex = 1050 - i;
        return {
          ...l,
          zIndex
        };
      }),
    'zIndex'
  );
});

// all layers for importing by other components
export const getActiveLayers = createSelector(getAllLayers, layers => {
  if (isEmpty(layers)) return [];
  return layers.filter(l => !l.confirmedOnly);
});

export const getActiveLayersWithDates = createSelector(
  getActiveLayers,
  layers => {
    if (isEmpty(layers)) return [];
    return layers.map(l => {
      const { decodeFunction, decodeParams } = l;
      const { startDate, endDate } = decodeParams || {};

      return {
        ...l,
        ...(decodeFunction &&
          decodeParams && {
          decodeParams: {
            ...decodeParams,
            ...(startDate && {
              startYear: moment(startDate).year(),
              startMonth: moment(startDate).month(),
              startDay: moment(startDate).month()
            }),
            ...(endDate && {
              endYear: moment(endDate).year(),
              endMonth: moment(endDate).month(),
              endDay: moment(endDate).month()
            }),
            ...getDayRange(decodeParams)
          }
        })
      };
    });
  }
);

export const getInteractiveLayerIds = createSelector(
  getActiveLayers,
  layers => {
    if (isEmpty(layers)) return [];
    const interactiveLayers = layers.filter(
      l => !isEmpty(l.interactionConfig) && l.layerConfig.body.vectorLayers
    );

    return flatMap(
      interactiveLayers.reduce((arr, layer) => {
        const clickableLayers = layer.layerConfig.body.vectorLayers;

        return [
          ...arr,
          clickableLayers.map((l, i) => `${layer.id}-${l.type}-${i}`)
        ];
      }, [])
    );
  }
);

export const getInteractionsState = createSelector(
  [selectMapData],
  mapData => mapData && mapData.interactions
);

export const getInteractionsLatLng = createSelector(
  [getInteractionsState],
  interactionData => interactionData && interactionData.latlng
);

export const getInteractionsData = createSelector(
  [getInteractionsState],
  interactionData => interactionData && interactionData.interactions
);

export const getInteractionSelectedId = createSelector(
  [getInteractionsState],
  interactionData => interactionData && interactionData.selected
);

export const getInteractions = createSelector(
  [getInteractionsData, getActiveLayers],
  (interactions, activeLayers) => {
    if (isEmpty(interactions)) return null;
    return Object.keys(interactions).map(i => {
      const layer = activeLayers.find(l => l.id === i);
      return {
        data: interactions[i].data,
        geometry: interactions[i].geometry,
        layer,
        label: layer && layer.name,
        value: layer && layer.id,
        article:
          layer && layer.interactionConfig && layer.interactionConfig.article
      };
    });
  }
);

export const getInteractionSelected = createSelector(
  [getInteractions, getInteractionSelectedId, getActiveLayers],
  (interactions, selected, layers) => {
    if (isEmpty(interactions)) return null;
    const layersWithoutBoundaries = layers.filter(
      l => !l.isBoundary && !isEmpty(l.interactionConfig)
    );
    const layersWithoutBoundariesIds =
      layersWithoutBoundaries &&
      layersWithoutBoundaries.length &&
      layersWithoutBoundaries.map(l => l.id);
    // if there is an article (icon layer) then choose that
    let selectedData = interactions.find(o => o.data.cluster);
    selectedData = interactions.find(o => o.article);
    // if there is nothing selected get the top layer
    if (!selected && !!layersWithoutBoundaries.length) {
      selectedData = interactions
        .reverse()
        .find(o => o.layer && layersWithoutBoundariesIds.includes(o.layer.id));
    }
    // if only one layer then get that
    if (!selectedData && interactions.length === 1) {
      selectedData = interactions[0];
    }
    // otherwise get based on selected
    if (!selectedData) {
      selectedData = interactions.find(o => o.layer && o.layer.id === selected);
    }

    return selectedData;
  }
);

export const getMapProps = createStructuredSelector({
  viewport: getMapViewport,
  loading: getMapLoading,
  loadingMessage: getLoadingMessage,
  minZoom: getMapMinZoom,
  maxZoom: getMapMaxZoom,
  mapStyle: getMapStyle,
  mapLabels: getMapLabels,
  mapRoads: getMapRoads,
  drawing: getDrawing,
  canBound: getCanBound,
  geostoreBbox: getGeostoreBbox,
  stateBbox: getStateBbox,
  interaction: getInteractionSelected,
  interactiveLayerIds: getInteractiveLayerIds,
  basemap: getBasemap
});
