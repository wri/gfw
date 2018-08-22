import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

import { formatDate } from 'utils/dates';

import thresholdOptions from 'data/thresholds.json';

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
        (param.key === 'endDate' || param.key === 'date') && !param.default
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

      // build statement config
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
        // default layer config
        ...info,
        ...applicationConfig,
        layer: id,
        iso,
        tags: flatten(d.vocabulary.map(v => v.tags)),
        // dropdown selector config
        ...((isSelectorLayer || isMultiSelectorLayer) && {
          selectorLayerConfig: {
            options: layer.map(l => ({
              ...l.applicationConfig.selectorConfig,
              value: l.id
            }))
          }
        }),
        // disclaimer statement config
        statementConfig,
        // layers config
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
                  // sorting position
                  position: l.applicationConfig.default
                    ? 0
                    : position ||
                      (multiConfig && multiConfig.position) ||
                      i + 1,
                  // params for tile url
                  ...(!isEmpty(params_config) && {
                    params: {
                      url: body.url || url,
                      ...reduceParams(params_config),
                      ...(latestDate && {
                        date: latestDate.split('-').join('')
                      })
                    }
                  }),
                  // params selector config
                  ...(params_config && {
                    paramsSelectorConfig: params_config
                      .filter(p => p.key !== 'dataMaxZoom' && p.key !== 'date')
                      .map(p => {
                        const isThresh =
                          p.key === 'threshold' || p.key === 'thresh';
                        const prefixEnd = isThresh ? 'with' : 'for';
                        const suffix = isThresh ? ' canopy density.' : '';
                        const options = isThresh ? thresholdOptions : p.options;
                        return {
                          ...p,
                          options,
                          prefix: `Displaying ${
                            l.name ? l.name.toLowerCase() : ''
                          } ${prefixEnd} `,
                          suffix
                        };
                      })
                  }),
                  // params for sql query
                  ...(!isEmpty(sql_config) && {
                    sqlParams: {
                      ...reduceSqlParams(sql_config)
                    }
                  }),
                  // decode func and params for canvas layers
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
                  // special key for GLAD alerts
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

export const getActiveDatasets = createSelector(
  [getParsedDatasets, getDatasetIds],
  (datasets, datasetIds) => {
    if (isEmpty(datasets) || isEmpty(datasetIds)) return null;
    return datasets.filter(
      d => datasetIds.includes(d.id) && d.env === 'production'
    );
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
