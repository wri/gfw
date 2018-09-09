import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';
import axios from 'axios';
import moment from 'moment';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';

import { getDatasetsProvider } from 'services/datasets';
import {
  fetchGLADLatest,
  fetchFormaLatest,
  fetchTerraLatest,
  fetchSADLatest,
  fetchGranChacoLatest
} from 'services/alerts';

import thresholdOptions from 'data/thresholds.json';

import { reduceParams, reduceSqlParams } from './datasets-utils';
import decodeLayersConfig from './datasets-decode-config';

export const setDatasetsLoading = createAction('setDatasetsLoading');
export const setDatasets = createAction('setDatasets');

export const getDatasets = createThunkAction(
  'getDatasets',
  () => (dispatch, getState) => {
    const state = getState();
    if (!state.datasets.datasets.length) {
      dispatch(setDatasetsLoading({ loading: true, error: false }));
      axios
        .all([
          getDatasetsProvider(),
          fetchGLADLatest(),
          fetchFormaLatest(),
          fetchTerraLatest(),
          fetchSADLatest(),
          fetchGranChacoLatest()
        ])
        .then(
          axios.spread((allDatasets, glads, forma, terra, sad, granChaco) => {
            // serialize datasets
            const serializedDatasets = wriAPISerializer(
              allDatasets.data
            ).filter(d => d.layer.length);

            // get dataset specific depdancies (latest dates for datasets)
            const gladsLatest = glads.data.data[0].attributes.date;
            const formaLatest = forma.data.date;
            const terraData = moment(`${terra.data.data[0].year}-01-01`)
              .add(terra.data.data[0].day, 'days')
              .format('YYYY-MM-DD');
            const sadLatest = moment(sad.data.rows[0].date).format(
              'YYYY-MM-DD'
            );
            const granChacoLatest = moment(granChaco.data.rows[0].date).format(
              'YYYY-MM-DD'
            );
            const latest = {
              'dd5df87f-39c2-4aeb-a462-3ef969b20b66': gladsLatest,
              '66203fea-2e58-4a55-b222-1dae075cf95d': formaLatest,
              '790b46ce-715a-4173-8f2c-53980073acb6': terraData,
              '3ec29734-4627-45b1-b320-680e4b4b939e': sadLatest,
              'c8829d15-e68a-4cb5-98a8-d0acff438a56': granChacoLatest
            };

            const parsedDatasets = serializedDatasets
              .filter(d => d.env === 'production')
              .map(d => {
                const { layer, metadata } = d;
                const appMeta =
                  (metadata && metadata.find(m => m.application === 'gfw')) ||
                  {};
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

                const { isSelectorLayer, isMultiSelectorLayer, isLossLayer } =
                  info || {};
                const { id, iso, applicationConfig } = defaultLayer || {};
                const { global, selectorConfig } = applicationConfig || {};

                // build statement config
                let statementConfig = null;
                if (isLossLayer) {
                  statementConfig = {
                    type: 'lossLayer'
                  };
                } else if (global && !!iso.length && iso[0]) {
                  statementConfig = {
                    type: 'isoLayer',
                    isos: iso
                  };
                }

                return {
                  id: d.id,
                  dataset: d.id,
                  name: d.name,
                  layer: id,
                  ...applicationConfig,
                  ...info,
                  iso,
                  tags: flatten(d.vocabulary.map(v => v.tags)),
                  // dropdown selector config
                  ...((isSelectorLayer || isMultiSelectorLayer) && {
                    selectorLayerConfig: {
                      options: layer.map(l => ({
                        ...l.applicationConfig.selectorConfig,
                        value: l.id
                      })),
                      ...selectorConfig
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

                          // check for timeline params
                          const hasParamsTimeline =
                            params_config &&
                            params_config.map(p => p.key).includes('startDate');
                          const hasDecodeTimeline =
                            decode_config &&
                            decode_config.map(p => p.key).includes('startDate');
                          const params =
                            params_config &&
                            reduceParams(params_config, latestDate);
                          const decodeParams =
                            decode_config &&
                            reduceParams(decode_config, latestDate);
                          const sqlParams =
                            sql_config && reduceSqlParams(sql_config);

                          return {
                            ...l,
                            ...l.applicationConfig,
                            // sorting position
                            position: l.applicationConfig.default
                              ? 0
                              : position ||
                                (multiConfig && multiConfig.position) ||
                                i + 1,
                            // check if needs timeline
                            hasParamsTimeline,
                            hasDecodeTimeline,
                            // params for tile url
                            ...(params && {
                              params: {
                                url: body.url || url,
                                ...params,
                                ...(hasParamsTimeline && {
                                  minDate: params && params.startDate,
                                  maxDate: params && params.endDate,
                                  trimEndDate: params && params.endDate
                                })
                              }
                            }),
                            // params selector config
                            ...(params_config && {
                              paramsSelectorConfig: params_config.map(p => ({
                                ...p,
                                ...(p.key.includes('thresh') && {
                                  sentence:
                                    'Displaying {name} with {selector} canopy density',
                                  options: thresholdOptions
                                }),
                                ...(p.min &&
                                  p.max && {
                                    options: Array.from(
                                      Array(p.max - p.min + 1).keys()
                                    ).map(o => ({
                                      label: o + p.min,
                                      value: o + p.min
                                    }))
                                  })
                              }))
                            }),
                            // params for sql query
                            ...(sqlParams && {
                              sqlParams
                            }),
                            // decode func and params for canvas layers
                            ...decodeFunction,
                            ...(decodeParams && {
                              decodeParams: {
                                ...(decodeFunction &&
                                  decodeFunction.decodeParams),
                                ...decodeParams,
                                ...(hasDecodeTimeline && {
                                  minDate:
                                    decodeParams && decodeParams.startDate,
                                  maxDate: decodeParams && decodeParams.endDate,
                                  trimEndDate:
                                    decodeParams && decodeParams.endDate,
                                  canPlay: true
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
            dispatch(setDatasets(parsedDatasets));
          })
        )
        .catch(err => {
          dispatch(setDatasetsLoading({ loading: false, error: true }));
          console.warn(err);
        });
    }
  }
);
