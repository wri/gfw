import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';

import { selectActiveLang, getMapboxLang } from 'utils/lang';
import { getActiveArea } from 'providers/areas-provider/selectors';

import { getDayRange, handleDynamicTimeline } from './utils';
import basemaps from './basemaps';

// map state
const selectMapLoading = (state) => state.map && state.map.loading;
const selectGeostoreLoading = (state) =>
  state.geostore && state.geostore.loading;
const selectLatestLoading = (state) => state.latest && state.latest.loading;
const selectDatasetsLoading = (state) =>
  state.datasets && state.datasets.loading;
const selectRecentImageryLoading = (state) =>
  state.recentImagery && state.recentImagery.loading;
const selectMapData = (state) => state.map && state.map.data;
const selectDatasets = (state) => state.datasets && state.datasets.data;
const selectLatest = (state) => state.latest && state.latest.data;
export const selectGeostore = (state) => state.geostore && state.geostore.data;
const getLocation = (state) => state.location;
const selectLocation = (state) => state.location && state.location.payload;

// CONSTS
export const getMapSettings = (state) => state.map?.settings || {};
export const getBasemaps = () => basemaps;
export const isTropics = (state) => state?.geostore?.data?.tropics || false;

export const getLatestPlanet = (state) => {
  if (state?.planet?.data?.length) {
    return state.planet.data[state.planet.data.length - 1].name;
  }
  return null;
};

// SELECTORS
export const getMapViewport = createSelector([getMapSettings], (settings) => {
  const { zoom, bearing, pitch, center } = settings;
  return {
    zoom,
    bearing,
    pitch,
    latitude: center?.lat,
    longitude: center?.lng,
    // The map transition needs to always be 0 otherwise the map becomes sluggish when panned or zoomed. Only set a
    // different value when flying between locations and only temporarily.
    transitionDuration: 0,
  };
});

export const getDatasetMetadata = (state) => state.datasets?.meta;
export const getLatestMetadata = (state) => state?.latest?.data;

export const getMapLatLng = createSelector(
  [getMapSettings],
  (settings) => settings.center
);

export const getMapZoom = createSelector(
  [getMapSettings],
  (settings) => settings.zoom
);

export const getMapMinZoom = createSelector(
  [getMapSettings],
  (settings) => settings.minZoom
);

export const getMapMaxZoom = createSelector(
  [getMapSettings],
  (settings) => settings.maxZoom
);

export const getBasemapFromState = createSelector(
  getMapSettings,
  (settings) => settings.basemap
);

export const getBasemap = createSelector(
  [getBasemapFromState, getLocation, getLatestPlanet],
  (basemapState, location, planetLatest) => {
    const isDashboard = location.pathname.includes('/dashboards/');

    let basemap = {
      ...basemaps[basemapState?.value],
      ...basemapState,
    };

    if (isDashboard && basemapState.value !== 'default') {
      if (basemapState.value !== 'planet') {
        basemap = basemaps.default;
      }
    }

    if (basemap.value === 'planet' && basemap.name === 'latest') {
      basemap.name = planetLatest;
    }

    let url = basemap && basemap.url;
    if (url) {
      Object.keys(basemap).forEach((key) => {
        if (url.includes(`{${key}}`)) {
          url = url.replace(`{${key}}`, basemap[key]);
        }
      });
    }
    return {
      ...basemap,
      ...(url && { url }),
    };
  }
);

export const getMapStyle = createSelector(
  getBasemap,
  (basemap) => basemap.mapStyle
);

export const getMapLabels = createSelector(
  getMapSettings,
  (settings) => settings.labels
);

export const getMapRoads = createSelector(
  getMapSettings,
  (settings) => settings.roads
);

export const getDrawing = createSelector(
  [getMapSettings],
  (settings) => settings.drawing
);

export const getCanBound = createSelector(
  getMapSettings,
  (settings) => settings.canBound
);

export const getGeostoreBbox = createSelector(
  [selectGeostore],
  (geostore) => geostore && geostore.bbox
);

export const getStateBbox = createSelector(
  [getMapSettings],
  (settings) => settings && settings.bbox
);

export const getMapLoading = createSelector(
  [
    selectMapLoading,
    selectGeostoreLoading,
    selectLatestLoading,
    selectDatasetsLoading,
    selectRecentImageryLoading,
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
  (settings) => settings.datasets
);

export const getActiveDatasetIds = createSelector(
  [getActiveDatasetsFromState],
  (activeDatasetsState) => {
    if (!activeDatasetsState || !activeDatasetsState.length) return null;
    return activeDatasetsState?.map((l) => l.dataset);
  }
);

export const getActiveDatasets = createSelector(
  [selectDatasets, getActiveDatasetIds],
  (datasets, datasetIds) => {
    if (isEmpty(datasets) || isEmpty(datasetIds)) return null;
    return datasets.filter((d) => datasetIds.includes(d.id));
  }
);

// parse active datasets to add config from url
export const getDatasetsWithConfig = createSelector(
  [
    getActiveDatasets,
    getActiveDatasetsFromState,
    selectLatest,
    getDatasetMetadata,
    getLatestMetadata,
  ],
  (
    datasets,
    activeDatasetsState,
    latestDates,
    datasetMetadata,
    latestMetadata
  ) => {
    if (isEmpty(datasets) || isEmpty(activeDatasetsState)) return null;

    return datasets.map((d) => {
      const layerConfig =
        activeDatasetsState.find((l) => l.dataset === d.id) || {};
      const {
        params,
        sqlParams,
        decodeParams,
        timelineParams,
        layers,
        visibility,
        opacity,
        bbox,
        citation = null,
      } = layerConfig || {};

      return {
        ...d,
        ...layerConfig,
        ...(d.selectorLayerConfig && {
          selectorLayerConfig: {
            ...d.selectorLayerConfig,
            selected: d.selectorLayerConfig.options.find(
              (l) => l.value === layers[0]
            ),
          },
        }),
        layers: d.layers.map((l) => {
          const {
            hasParamsTimeline,
            hasDecodeTimeline,
            timelineConfig: timelineConfigInit,
            id,
          } = l;
          return handleDynamicTimeline(
            l,
            datasetMetadata,
            timelineParams,
            latestMetadata,
            (dynamicTimeline) => {
              const maxDate = latestDates[id];
              const { latestFormat } = l.params || {};
              const maxDateFormatted = latestFormat
                ? moment(maxDate).format(latestFormat)
                : maxDate;

              const {
                min: minRange,
                max: maxRange,
                interval: rangeInterval,
                default: defaultRange,
              } = (timelineConfigInit && timelineConfigInit.dateRange) || {};

              const timelineConfig = {
                ...timelineConfigInit,
                ...(dynamicTimeline && {
                  ...dynamicTimeline,
                }),
                ...(maxRange &&
                  rangeInterval &&
                  timelineConfigInit && {
                    startDate: moment(maxDate || timelineConfigInit.maxDate)
                      .subtract(defaultRange || maxRange, rangeInterval)
                      .format('YYYY-MM-DD'),
                    startDateAbsolute: moment(
                      maxDate || timelineConfigInit.maxDate
                    )
                      .subtract(defaultRange || maxRange, rangeInterval)
                      .format('YYYY-MM-DD'),
                  }),
                maxRange,
                dynamicTimeline: dynamicTimeline !== null,
                minRange,
                rangeInterval,
              };

              const layerParams = {
                ...l.params,
                ...(maxRange &&
                  rangeInterval &&
                  timelineConfigInit && {
                    startDate: moment(maxDate || timelineConfigInit.maxDate)
                      .subtract(defaultRange || maxRange, rangeInterval)
                      .format('YYYY-MM-DD'),
                    startDateAbsolute: moment(
                      maxDate || timelineConfigInit.maxDate
                    )
                      .subtract(defaultRange || maxRange, rangeInterval)
                      .format('YYYY-MM-DD'),
                    endDateAbsolute: maxDate || l.params.endDate,
                  }),
                ...(dynamicTimeline && {
                  startDate: dynamicTimeline.startDate,
                }),
              };

              const out = {
                ...l,
                visibility,
                opacity,
                bbox,
                ...(citation && {
                  citation,
                }),
                color: d.color,
                active: layers && layers.length && layers.includes(l.id),
                ...(!isEmpty(layerParams) && {
                  params: {
                    ...layerParams,
                    ...(maxDate && {
                      endDate: maxDate,
                    }),
                    ...params,
                    ...(maxDateFormatted && {
                      date: maxDateFormatted,
                    }),
                    ...(hasParamsTimeline && {
                      ...timelineParams,
                    }),
                    ...(maxDate && {
                      maxDate,
                    }),
                  },
                }),
                ...(!isEmpty(l.sqlParams) && {
                  sqlParams: {
                    ...l.sqlParams,
                    ...sqlParams,
                  },
                }),
                ...(l.decodeFunction && {
                  decodeParams: {
                    ...l.decodeParams,
                    ...(layers && {
                      confirmedOnly: layers.includes('confirmedOnly') ? 1 : 0,
                      gladLOnly: layers.includes('gladLOnly') ? 1 : 0,
                      gladSOnly: layers.includes('gladSOnly') ? 1 : 0,
                      raddOnly: layers.includes('raddOnly') ? 1 : 0,
                    }),
                    ...(maxDate && {
                      endDate: maxDate,
                    }),
                    ...decodeParams,
                    ...(hasDecodeTimeline && {
                      ...timelineParams,
                    }),
                    ...(maxDate && {
                      maxDate,
                    }),
                    ...(dynamicTimeline && {
                      ...dynamicTimeline,
                    }),
                  },
                }),
                ...((l.hasParamsTimeline || l.hasDecodeTimeline) && {
                  timelineParams: {
                    ...timelineConfig,
                    ...(l.hasParamsTimeline && {
                      ...layerParams,
                    }),
                    ...(l.hasDecodeTimeline && {
                      ...l.decodeParams,
                    }),
                    ...(maxDate && {
                      endDate: maxDate,
                      maxDate,
                      trimEndDate: maxDate,
                    }),
                    ...timelineParams,
                    ...(dynamicTimeline && {
                      ...dynamicTimeline,
                    }),
                  },
                }),
              };

              return out;
            }
          );
        }),
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
      .map((layer) => {
        const dataset = datasets.find((d) => d.id === layer.dataset);
        const { metadata } =
          (dataset && dataset.layers.find((l) => l.active)) || {};
        const newMetadata = metadata || (dataset && dataset.metadata);

        return {
          ...dataset,
          ...(newMetadata && {
            metadata: newMetadata,
          }),
        };
      })
      .filter((d) => !isEmpty(d));
  }
);

// flatten datasets into layers for the layer manager
export const getAllLayers = createSelector(getLayerGroups, (layerGroups) => {
  if (isEmpty(layerGroups)) return null;

  return sortBy(
    flatten(layerGroups.map((d) => d.layers))
      .filter((l) => l && l.active && (!l.isRecentImagery || l.params.url))
      .map((l, i) => {
        let zIndex = 1000 - i;
        if (l.isRecentImagery) zIndex = 500;
        if (l.isBoundary) zIndex = 1050 - i;
        return {
          ...l,
          zIndex,
          ...(l.isRecentImagery && {
            id: l.params.url,
          }),
        };
      }),
    'zIndex'
  );
});

// all layers for importing by other components
export const getActiveLayers = createSelector(
  [getAllLayers, selectGeostore, selectLocation, getActiveArea],
  (layers, geostore, location, activeArea) => {
    if (isEmpty(layers)) return [];
    const filteredLayers = layers.filter((l) => !l.confirmedOnly);
    if (!geostore || !geostore.id) return filteredLayers;
    const { type, adm0 } = location || {};
    const isAoI = type === 'aoi' && adm0;

    const geojson = {
      ...geostore.geojson,
      ...(activeArea && {
        features: [
          {
            ...geostore.geojson.features?.[0],
            properties: activeArea,
          },
        ],
      }),
    };

    const parsedLayers = filteredLayers.concat({
      id: geostore.id,
      name: isAoI ? 'Area of Interest' : 'Geojson',
      config: {
        type: 'geojson',
        source: {
          data: geojson,
          type: 'geojson',
        },
        render: {
          layers: [
            {
              type: 'fill',
              paint: {
                'fill-color': 'transparent',
              },
            },
            {
              type: 'line',
              paint: {
                'line-color': '#C0FF24',
                'line-width': isAoI ? 3 : 1,
                'line-offset': isAoI ? 2 : 0,
              },
            },
            {
              type: 'line',
              paint: {
                'line-color': '#000',
                'line-width': 2,
              },
            },
          ],
        },
      },
      ...(isAoI && {
        interactionConfig: {
          output: [],
        },
      }),
      zIndex: 1060,
    });

    return parsedLayers;
  }
);

export const getActiveLayersWithDates = createSelector(
  getActiveLayers,
  (layers) => {
    if (isEmpty(layers)) return [];
    return layers.map((l) => {
      const { decodeFunction, decodeParams, params } = l;
      const { startDate, endDate } = decodeParams || {};
      return {
        ...l,
        ...(decodeFunction &&
          decodeParams && {
            decodeParams: {
              ...decodeParams,
              ...(startDate && {
                startDate: params?.startDate || startDate,
                startYear: moment(startDate).year(),
                startMonth: moment(startDate).month(),
                startDay: moment(startDate).dayOfYear(),
              }),
              ...(endDate && {
                endYear: moment(endDate).year(),
                endMonth: moment(endDate).month(),
                endDay: moment(endDate).dayOfYear(),
              }),
              ...getDayRange(decodeParams),
            },
          }),
        ...(params &&
          params.startDate && {
            params: {
              ...params,
              ...(params.startDate && {
                startDate: params.startDate,
                startYear: moment(params.startDate).year(),
                startMonth: moment(params.startDate).month(),
                startDay: moment(params.startDate).dayOfYear(),
              }),
              ...(params?.endDate && {
                endYear: moment(params.endDate).year(),
                endMonth: moment(params.endDate).month(),
                endDay: moment(params.endDate).dayOfYear(),
              }),
              ...getDayRange(params),
            },
          }),
      };
    });
  }
);

export const getInteractiveLayerIds = createSelector(
  getActiveLayers,
  (layers) => {
    if (isEmpty(layers)) return [];

    const interactiveLayers = layers.filter(
      (l) =>
        !isEmpty(l.interactionConfig) &&
        l.layerConfig &&
        l.layerConfig.render &&
        l.layerConfig.render.layers
    );

    return flatMap(
      interactiveLayers.reduce((arr, layer) => {
        const clickableLayers =
          layer.layerConfig.render && layer.layerConfig.render.layers;

        return [
          ...arr,
          clickableLayers.map((l, i) => `${layer.id}-${l.type}-${i}`),
        ];
      }, [])
    );
  }
);

export const getInteractionsState = createSelector(
  [selectMapData],
  (mapData) => mapData && mapData.interactions
);

export const getInteractionsLatLng = createSelector(
  [getInteractionsState],
  (interactionData) => interactionData && interactionData.latlng
);

export const getInteractionsData = createSelector(
  [getInteractionsState],
  (interactionData) => interactionData && interactionData.interactions
);

export const getInteractionSelectedId = createSelector(
  [getInteractionsState],
  (interactionData) => interactionData && interactionData.selected
);

export const getInteractions = createSelector(
  [getInteractionsData, getActiveLayers],
  (interactions, activeLayers) => {
    if (isEmpty(interactions)) return null;
    return Object.keys(interactions).map((layerId) => {
      const layer = activeLayers.find((l) => l.id === layerId);
      const { data, ...interaction } = interactions?.[layerId] || {};

      return {
        ...interaction,
        data: {
          ...data,
          ...data?.properties,
        },
        layer,
      };
    });
  }
);

export const getInteractionSelected = createSelector(
  [getInteractions, getInteractionSelectedId, getActiveLayers],
  (interactions, selected, layers) => {
    if (isEmpty(interactions)) return null;
    const layersWithoutBoundaries = layers.filter(
      (l) => !l.isBoundary && !isEmpty(l.interactionConfig)
    );
    const layersWithoutBoundariesIds =
      layersWithoutBoundaries &&
      layersWithoutBoundaries.length &&
      layersWithoutBoundaries.map((l) => l.id);
    // if there is an article (icon layer) then choose that
    let selectedData = interactions.find((o) => o.data.cluster);
    selectedData = interactions.find((o) => o.article);
    // if there is nothing selected get the top layer
    if (!selected && !!layersWithoutBoundaries.length) {
      selectedData = interactions.find(
        (o) => o.layer && layersWithoutBoundariesIds.includes(o.layer.id)
      );
    }

    // if only one layer then get that
    if (!selectedData && interactions.length === 1) {
      [selectedData] = interactions;
    }

    // otherwise get based on selected
    if (!selectedData) {
      selectedData = interactions.find(
        (o) => o.layer && o.layer.id === selected
      );
    }

    return selectedData;
  }
);

export const getActiveMapLang = createSelector(selectActiveLang, (lang) =>
  getMapboxLang(lang)
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
  basemap: getBasemap,
  lang: getActiveMapLang,
});
