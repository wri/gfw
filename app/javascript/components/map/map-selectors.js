import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

import { formatDate } from 'utils/dates';

import initialState from './map-initial-state';
import decodeLayersConfig from './map-decode-config';
import statements from './map-statement-config';

// get list data
const getMapUrlState = state => (state.query && state.query.map) || null;
const getDatasets = state => state.datasets.filter(d => !isEmpty(d.layer));
const getLoading = state => state.loading;
const getGeostore = state => state.geostore || null;
const getLatest = state => state.latest || null;
const getCountries = state => state.countries || null;

const reduceParams = params => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      [param.key]:
        param.key === 'endDate' && !param.default
          ? formatDate(new Date())
          : param.default
    };
    return newObj;
  }, {});
};

const reduceSqlParams = params => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      [param.key]: param.key_params.reduce((subObj, item) => {
        const keyValues = {
          ...subObj,
          [item.key]: item.value
        };
        return keyValues;
      }, {})
    };
    return newObj;
  }, {});
};

export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...initialState,
  ...urlState
}));

export const getLayers = createSelector(
  getMapSettings,
  settings => settings.layers
);

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

export const getParsedDatasets = createSelector(
  [getDatasets, getLatest, getCountries],
  (datasets, latest, countries) => {
    if (isEmpty(datasets)) return null;
    return datasets.filter(d => d.env === 'production').map(d => {
      const { layer, metadata } = d;
      const appMeta = metadata.find(m => m.application === 'gfw') || {};
      const { info } = appMeta || {};
      const defaultLayer =
        (layer &&
          layer.find(
            l =>
              l.env === 'production' &&
              l.applicationConfig &&
              l.applicationConfig.default
          )) ||
        layer[0];

      // we need a default layer so we can set it when toggled onto the map
      if (!defaultLayer) return null;

      const { isSelectorLayer, isMultiSelectorLayer, isLossLayer } = info || {};
      const { id, iso, applicationConfig } = defaultLayer || {};
      const { global } = applicationConfig || {};

      let statementConfig = null;
      if (isLossLayer) {
        statementConfig = {
          ...statements.loss
        };
      } else if (global && !!iso.length && iso[0]) {
        statementConfig = {
          ...statements.isoLayer,
          tooltipDesc:
            countries &&
            countries
              .filter(c => iso.includes(c.value))
              .map(c => c.label)
              .join(', ')
        };
      }

      return {
        ...d,
        dataset: d.id,
        ...info,
        ...((isSelectorLayer || isMultiSelectorLayer) && {
          selectorLayerConfig: {
            options: layer.map(l => ({
              ...l.applicationConfig.selectorConfig,
              value: l.id
            }))
          }
        }),
        ...applicationConfig,
        tags: flatten(d.vocabulary.map(v => v.tags)),
        layer: id,
        iso,
        statementConfig,
        layers:
          layer &&
          sortBy(
            layer
              .filter(l => l.env === 'production' && l.published)
              .map((l, i) => {
                const { layerConfig } = l;
                const { position, confirmedOnly, multiConfig } =
                  l.applicationConfig || {};
                const {
                  params_config,
                  decode_config,
                  sql_config,
                  body,
                  url
                } = layerConfig;
                const decodeFunction = decodeLayersConfig[l.id];
                const latestDate = latest && latest[l.id];

                return {
                  ...l,
                  ...l.applicationConfig,
                  position: l.applicationConfig.default
                    ? 0
                    : position ||
                      (multiConfig && multiConfig.position) ||
                      i + 1,

                  ...(!isEmpty(params_config) && {
                    params: {
                      url: body.url || url,
                      ...reduceParams(params_config)
                    }
                  }),
                  ...(!isEmpty(sql_config) && {
                    sqlParams: {
                      ...reduceSqlParams(sql_config)
                    }
                  }),
                  ...decodeFunction,
                  ...(!isEmpty(decode_config) && {
                    decodeParams: {
                      ...(decodeFunction && decodeFunction.decodeParams),
                      ...reduceParams(decode_config),
                      ...(latestDate && {
                        endDate: latestDate
                      })
                    }
                  }),
                  ...(confirmedOnly && {
                    id: 'confirmedOnly'
                  })
                };
              }),
            'position'
          )
      };
    });
  }
);

export const getDatasetIds = createSelector([getLayers], layers => {
  if (!layers || !layers.length) return null;
  return layers.map(l => l.dataset);
});

export const getLayersDatasets = createSelector(
  [getParsedDatasets, getDatasetIds],
  (datasets, datasetIds) => {
    if (isEmpty(datasets) || isEmpty(datasetIds)) return null;
    return datasets.filter(d => datasetIds.includes(d.id));
  }
);

export const getActiveDatasets = createSelector(
  [getLayersDatasets],
  datasets => {
    if (!datasets) return null;
    return datasets.filter(d => d.env === 'production');
  }
);

export const getBoundaryDatasets = createSelector(
  [getParsedDatasets],
  datasets => {
    if (!datasets) return null;
    return datasets.filter(d => d.env === 'production' && d.isBoundary);
  }
);

export const getActiveBoundaries = createSelector(
  [getBoundaryDatasets, getLayers],
  (datasets, layers) => {
    const layerIds = layers.map(layer => layer.dataset);
    return datasets.find(d => layerIds.includes(d.dataset));
  }
);

export const getDatasetsWithConfig = createSelector(
  [getActiveDatasets, getLayers],
  (datasets, allLayers) => {
    if (isEmpty(datasets) || isEmpty(allLayers)) return null;

    return datasets.map(d => {
      const layerConfig = allLayers.find(l => l.dataset === d.id) || {};
      const { params, sqlParams, decodeParams, layers, visibility, opacity } =
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
        layers: d.layers.map(l => ({
          ...l,

          visibility,
          opacity,
          active: layers && layers.includes(l.id),
          ...(!isEmpty(params) && {
            params: {
              ...l.params,
              ...params
            }
          }),
          ...(!isEmpty(sqlParams) && {
            sqlParams: {
              ...l.sqlParams,
              ...sqlParams
            }
          }),
          ...(!isEmpty(l.decodeParams) &&
            l.decodeFunction && {
              decodeParams: {
                ...l.decodeParams,
                minDate: l.decodeParams && l.decodeParams.startDate,
                maxDate: l.decodeParams && l.decodeParams.endDate,
                trimEndDate: l.decodeParams && l.decodeParams.endDate,
                ...(layers &&
                  layers.includes('confirmedOnly') && {
                    confirmedOnly: true
                  }),
                ...decodeParams
              }
            }),
          ...(l.decodeParams &&
            l.decodeParams.startDate && {
              timelineConfig: {
                ...l.decodeParams,
                minDate: l.decodeParams && l.decodeParams.startDate,
                maxDate: l.decodeParams && l.decodeParams.endDate,
                trimEndDate: l.decodeParams && l.decodeParams.endDate,
                ...decodeParams
              }
            })
        }))
      };
    });
  }
);

export const getLayerGroups = createSelector(
  [getDatasetsWithConfig, getLayers],
  (datasets, layers) => {
    if (isEmpty(datasets) || isEmpty(layers)) return null;
    return layers.map(l => datasets.find(d => d.id === l.dataset));
  }
);

export const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary);
});

export const getActiveLayers = createSelector(getLayerGroups, layerGroups => {
  if (isEmpty(layerGroups)) return [];
  return flatten(layerGroups.map(d => d.layers)).filter(
    l => l.active && !l.confirmedOnly
  );
});

export const getMapProps = createStructuredSelector({
  layers: getLayers,
  settings: getMapSettings,
  mapOptions: getMapOptions,
  basemap: getBasemap,
  label: getLabels,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers,
  loading: getLoading,
  bbox: getBBox
});
