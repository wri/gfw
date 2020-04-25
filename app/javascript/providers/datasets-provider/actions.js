import { createAction, createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import chroma from 'chroma-js';

import { getDatasetsProvider } from 'services/datasets';
import thresholdOptions from 'data/thresholds.json';

import { reduceParams, reduceSqlParams } from './utils';
import decodeLayersConfig from './config';

export const setDatasetsLoading = createAction('setDatasetsLoading');
export const setDatasets = createAction('setDatasets');

const byVocabulary = dataset =>
  dataset.vocabulary &&
  dataset.vocabulary.some(
    o => o.name === 'layer_manager_ver' && o.tags.includes('3.0')
  );

export const getDatasets = createThunkAction('getDatasets', () => dispatch => {
  getDatasetsProvider()
    .then(allDatasets => {
      const parsedDatasets = wriAPISerializer(allDatasets.data)
        .filter(
          d =>
            d.published &&
            d.layer.length &&
            (d.env === 'production' || d.env === process.env.FEATURE_ENV)
        )
        .filter(byVocabulary)
        .map(d => {
          const { layer, metadata } = d;
          const appMeta =
            (metadata && metadata.find(m => m.application === 'gfw')) || {};
          const { info } = appMeta || {};
          const defaultLayer =
            (layer &&
              layer.find(
                l =>
                  (l.env === 'production' ||
                    l.env === process.env.FEATURE_ENV) &&
                  l.applicationConfig &&
                  l.applicationConfig.default
              )) ||
            layer[0];
          // we need a default layer so we can set it when toggled onto the map
          if (!defaultLayer) return null;

          const {
            isSelectorLayer,
            isMultiSelectorLayer,
            isLossLayer,
            isLossDriverLayer
          } =
            info || {};
          const { id, iso, applicationConfig } = defaultLayer || {};
          const { global, selectorConfig } = applicationConfig || {};

          // build statement config
          let statementConfig =
            defaultLayer.legendConfig && defaultLayer.legendConfig.statement
              ? { statement: defaultLayer.legendConfig.statement }
              : null;
          if (isLossLayer) {
            statementConfig = {
              type: 'lossLayer'
            };
          } else if (isLossDriverLayer) {
            statementConfig = {
              type: 'lossDriverLayer'
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
                  .filter(
                    l =>
                      (l.env === 'production' ||
                        l.env === process.env.FEATURE_ENV) &&
                      l.published
                  )
                  .map((l, i) => {
                    const { layerConfig, legendConfig } = l;
                    const { position, confirmedOnly, multiConfig } =
                      l.applicationConfig || {};
                    const {
                      params_config,
                      decode_config,
                      sql_config,
                      timeline_config,
                      source, // v3
                      decode_function // v3
                    } = layerConfig;
                    const { tiles } = source; // previously url
                    const decodeFunction = decodeLayersConfig[decode_function];
                    const customColor =
                      legendConfig &&
                      legendConfig.items &&
                      legendConfig.items[0].color;

                    // check if has a timeline
                    const hasParamsTimeline =
                      params_config &&
                      params_config.map(p => p.key).includes('startDate');
                    const hasDecodeTimeline =
                      decode_config &&
                      decode_config.map(p => p.key).includes('startDate');
                    const timelineConfig = timeline_config && {
                      ...timeline_config,
                      railStyle: {
                        background: '#d6d6d9',
                        borderRadius: '0px'
                      },
                      trackStyle: [
                        {
                          background: customColor
                        },
                        {
                          background: chroma(customColor).darken(1.3)
                        }
                      ]
                    };

                    // get params
                    const params = params_config && reduceParams(params_config);
                    const decodeParams =
                      decode_config && reduceParams(decode_config);
                    const sqlParams = sql_config && reduceSqlParams(sql_config);

                    return {
                      ...info,
                      ...l,
                      ...(d.tableName && { tableName: d.tableName }),
                      ...l.applicationConfig,
                      // sorting position
                      position: l.applicationConfig.default
                        ? 0
                        : position ||
                          (multiConfig && multiConfig.position) ||
                          i + 1,
                      // check if needs timeline
                      timelineConfig,
                      hasParamsTimeline,
                      hasDecodeTimeline,
                      // params for tile url
                      ...(params && {
                        params: {
                          url: tiles && tiles.length && tiles[0],
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
                      // decode params selector config
                      ...(decode_config && {
                        decodeParamsSelectorConfig: decode_config.map(p => ({
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
                      decodeFunction,
                      ...(decodeParams && {
                        decodeParams: {
                          // timeline config
                          ...decodeParams,
                          ...(hasDecodeTimeline && {
                            minDate: decodeParams.startDate,
                            maxDate: decodeParams.endDate,
                            trimEndDate: decodeParams.endDate,
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
      dispatch(setDatasets(sortBy(parsedDatasets, 'menuPosition')));
    })
    .catch(err => {
      dispatch(setDatasetsLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
