import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import moment from 'moment';

import initialState from './map-initial-state';
import decodeLayersConfig from './map-decode-config';

// get list data
const getMapUrlState = state => (state.query && state.query.map) || null;
const getDatasets = state => state.datasets;
const getLoading = state => state.loading;

// get map settings
export const getMapSettings = createSelector(getMapUrlState, urlState => ({
  ...initialState,
  ...urlState
}));

export const getLayers = createSelector(
  getMapSettings,
  settings => settings.layers
);

export const getLayerGroups = createSelector(
  [getDatasets, getLayers],
  (datasets, layers) => {
    if (!datasets || !datasets.length || !layers || !layers.length) return null;

    return layers
      .map(l => {
        const dataset = datasets.find(d => d.id === l.dataset);

        return {
          ...dataset,
          ...l,
          layers:
            dataset.layer && dataset.layer.length > 0
              ? dataset.layer.map(layer => {
                const decodeFunction = decodeLayersConfig[layer.id];
                const paramsConfig = layer.layerConfig.params_config;
                const decodeConfig = layer.layerConfig.decode_config;
                const sqlConfig = layer.layerConfig.sql_config;

                return {
                  ...layer,
                  ...l,
                  active: l.layer === layer.id,
                  ...(!!paramsConfig &&
                      !!paramsConfig.length && {
                      params: {
                        url:
                            layer.layerConfig.body.url || layer.layerConfig.url,
                        ...paramsConfig.reduce((obj, param) => {
                          obj[param.key] = param.default;
                          return obj;
                        }, {}),
                        ...l.params
                      }
                    }),
                  ...(!!sqlConfig &&
                      !!sqlConfig.length && {
                      sqlParams: {
                        ...sqlConfig.reduce((obj, param) => {
                          obj[param.key] = param.default;
                          return obj;
                        }, {}),
                        ...l.decodeParams
                      },
                      ...l.sqlParams
                    }),
                  ...decodeFunction,
                  ...(!!decodeConfig &&
                      !!decodeConfig.length &&
                      !!decodeFunction && {
                      decodeParams: {
                        ...decodeFunction.decodeParams,
                        ...decodeConfig.reduce((obj, param) => {
                          const { key } = param;
                          obj[key] =
                              param.default || moment().format('YYYY-MM-DD');
                          if (key === 'startDate') {
                            obj.minDate = param.default;
                          }
                          if (key === 'endDate') {
                            obj.maxDate =
                                param.default || moment().format('YYYY-MM-DD');
                            obj.trimEndDate =
                                param.default || moment().format('YYYY-MM-DD');
                          }
                          return obj;
                        }, {}),
                        ...l.decodeParams
                      }
                    })
                };
              })
              : []
        };
      })
      .filter(l => l.layers && l.layers.length > 0);
  }
);

export const getActiveLayers = createSelector(getLayerGroups, layerGroups => {
  if (!layerGroups || !layerGroups.length) return null;
  return flatten(layerGroups.map(d => d.layers)).filter(l => l.active);
});

export const getMapProps = createStructuredSelector({
  layers: getLayers,
  settings: getMapSettings,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers,
  loading: getLoading
});
