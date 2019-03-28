import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import intersection from 'lodash/intersection';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';

import { getDayRange } from 'utils/dates';

import { parseWidgetsWithOptions } from 'components/widgets/selectors';
import { initialState } from './reducers';
import basemaps, { labels } from './basemaps-schema';

// map state
const selectMapUrlState = state =>
  state.location && state.location.query && state.location.query.map;
const selectMapLoading = state => state.map && state.map.loading;
const selectGeostoreLoading = state => state.geostore && state.geostore.loading;
const selectBasemapsLoading = state => state.basemaps && state.basemaps.loading;
const selectLatestLoading = state => state.latest && state.latest.loading;
const selectRecentImageryLoading = state =>
  state.recentImagery && state.recentImagery.loading;
const selectDatasetsLoading = state => state.datasets && state.datasets.loading;
const selectDrawLoading = state => state.draw && state.draw.loading;
const selectLocation = state => state.location;

// datasets
const selectDatasets = state => state.datasets && state.datasets.data;
const selectLatest = state => state.latest && state.latest.data;

// location
const selectGeostore = state => state.geostore && state.geostore.data;

// interactions
const selectSelectedInteractionId = state =>
  state.popup && state.popup.selected;
const selectInteractions = state => state.popup && state.popup.interactions;

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

export const getMapLat = createSelector(
  getMapSettings,
  settings => settings.center.lat
);

export const getMapLng = createSelector(
  getMapSettings,
  settings => settings.center.lng
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

export const getMapOptions = createSelector([getMapSettings], settings => {
  if (!settings) return null;
  const { minZoom, maxZoom, attributionControl } = settings;
  return {
    minZoom,
    maxZoom,
    attributionControl
  };
});

export const getMapLoading = createSelector(
  [
    selectMapLoading,
    selectGeostoreLoading,
    selectLatestLoading,
    selectDatasetsLoading,
    selectDrawLoading,
    selectRecentImageryLoading,
    selectBasemapsLoading
  ],
  (
    mapLoading,
    geostoreLoading,
    latestLoading,
    datasetsLoading,
    drawLoading,
    recentImageryLoading,
    basemapsLoading
  ) =>
    mapLoading ||
    geostoreLoading ||
    latestLoading ||
    datasetsLoading ||
    drawLoading ||
    recentImageryLoading ||
    basemapsLoading
);

export const getLoadingMessage = createSelector(
  [selectRecentImageryLoading, selectLatestLoading],
  (recentLoading, latestLoading) => {
    if (recentLoading) return 'Fetching the most recent satellite image...';
    if (latestLoading) return 'Fetching latest data...';
    return '';
  }
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

export const getInteractiveLayers = createSelector(getActiveLayers, layers => {
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
});

// get widgets related to map layers and use them to build the layers
export const getWidgetsWithLayerParams = createSelector(
  [parseWidgetsWithOptions, getActiveLayersWithDates],
  (widgets, layers) => {
    if (!widgets || !widgets.length || !layers || !layers.length) return null;
    const layerIds = layers && layers.map(l => l.id);
    const filteredWidgets = widgets.filter(w => {
      const layerIntersection = intersection(w.config.layers, layerIds);
      return w.config.analysis && layerIntersection && layerIntersection.length;
    });
    return filteredWidgets.map(w => {
      const widgetLayer =
        layers && layers.find(l => w.config && w.config.layers.includes(l.id));
      const { params, decodeParams } = widgetLayer || {};
      const startDate =
        (params && params.startDate) ||
        (decodeParams && decodeParams.startDate);
      const startYear =
        startDate && parseInt(moment(startDate).format('YYYY'), 10);
      const endDate =
        (params && params.endDate) || (decodeParams && decodeParams.endDate);
      const endYear = endDate && parseInt(moment(endDate).format('YYYY'), 10);

      return {
        ...w,
        settings: {
          ...w.settings,
          ...params,
          ...decodeParams,
          ...(startYear && {
            startYear
          }),
          ...(endYear && {
            endYear
          })
        }
      };
    });
  }
);

// flatten datasets into layers for the layer manager
export const getActiveLayersWithWidgetSettings = createSelector(
  [getActiveLayersWithDates, getWidgetsWithLayerParams],
  (layers, widgets) => {
    if (isEmpty(layers)) return [];
    if (isEmpty(widgets)) return layers;
    return layers.map(l => {
      const layerWidgetState =
        widgets &&
        Object.values(widgets).find(w => w.layers && w.layers.includes(l.id));
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
  [selectInteractions, getActiveLayers],
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

export const getSelectedInteraction = createSelector(
  [filterInteractions, selectSelectedInteractionId, getActiveLayers],
  (options, selected, layers) => {
    if (isEmpty(options)) return null;
    const layersWithoutBoundaries = layers.filter(
      l => !l.isBoundary && !isEmpty(l.interactionConfig)
    );
    // if there is an article (icon layer) then choose that
    let selectedData = options.find(o => o.data.cluster);
    selectedData = options.find(o => o.article);
    // if there is nothing selected get the top layer
    if (!selected && !!layersWithoutBoundaries.length) {
      selectedData = options.find(
        o => o.layer && o.layer.id === layersWithoutBoundaries[0].id
      );
    }
    // if only one layer then get that
    if (!selectedData && options.length === 1) selectedData = options[0];
    // otherwise get based on selected
    if (!selectedData) {
      selectedData = options.find(o => o.layer && o.layer.id === selected);
    }

    return selectedData;
  }
);

export const getMapProps = createStructuredSelector({
  loading: getMapLoading,
  loadingMessage: getLoadingMessage,
  location: selectLocation,
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabel,
  layerBbox: getLayerBbox,
  geostoreBbox: getGeostoreBbox,
  bbox: getBbox,
  canBound: getCanBound,
  draw: getDraw,
  lat: getMapLat,
  lng: getMapLng,
  zoom: getMapZoom,
  selectedInteraction: getSelectedInteraction,
  interactiveLayers: getInteractiveLayers
});
