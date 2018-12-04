import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';

import { getTileGeoJSON } from './components/recent-imagery/recent-imagery-selectors';
import { initialState } from './reducers';

// get list data
const getMapUrlState = state =>
  (state.location && state.location.query && state.location.query.map) || null;
const getDatasets = state => state.datasets.data;
const getLatest = state => state.latest.data;
const getLoading = state =>
  state.datasets.loading ||
  state.geostore.loading ||
  state.map.loading ||
  state.latest.loading;
const getGeostore = state => state.geostore.data || null;
const getQuery = state => (state.location && state.location.query) || null;
const selectEmbed = state =>
  (state.location &&
    state.location.pathname &&
    state.location.pathname.includes('embed')) ||
  null;
const selectLocation = state =>
  (state.location && state.location.payload) || null;
// analysis selects
const selectAnalysisSettings = state =>
  state.location && state.location.query && state.location.query.analysis;
const selectWidgetActiveSettings = state => state.widgets.settings;
// popup interactons
const selectSelectedInteractionId = state => state.popup.selected;
const selectInteractions = state => state.popup.interactions;
const selectMenuSection = state =>
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.menuSection;

// get all map settings
export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...initialState.settings,
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
  [getMapSettings, selectAnalysisSettings],
  (settings, analysisSettings) => settings.draw && analysisSettings.showDraw
);

export const getBbox = createSelector(
  getMapSettings,
  settings => settings.bbox
);

export const getHidePanels = createSelector(
  getMapSettings,
  settings => settings.hidePanels
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
    layers: d.layers.map(l => l.id),
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
  [getActiveDatasets, getActiveDatasetsState, getLatest],
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
  [getDatasetsWithConfig, getActiveDatasetsState],
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
  [getGeostore],
  geostore => geostore && geostore.bbox
);

// analysis
export const getShowAnalysis = createSelector(
  getQuery,
  query => query && query.analysis && query.analysis.showAnalysis
);

export const getOneClickAnalysisActive = createSelector(
  [selectAnalysisSettings, selectLocation, getDraw, getLoading],
  (settings, location, draw, loading) =>
    settings &&
    !draw &&
    !loading &&
    settings.showAnalysis &&
    !settings.showDraw &&
    !location.adm0
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
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabels,
  loading: getLoading,
  layerBbox: getLayerBbox,
  geostoreBbox: getGeostoreBbox,
  bbox: getBbox,
  canBound: getCanBound,
  tileGeoJSON: getTileGeoJSON,
  draw: getDraw,
  analysisActive: getShowAnalysis,
  oneClickAnalysisActive: getOneClickAnalysisActive,
  embed: selectEmbed,
  hidePanels: getHidePanels,
  selectedInteraction: getSelectedInteraction,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsState
});
