import { createSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;
const getMinimalist = state => state.minimalist || false;

export const filterData = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;

  let sortedData = [];
  if (Array.isArray(data)) {
    sortedData = isEmpty(data)
      ? [{ value: 0 }]
      : sortByKey(
        data
          .filter(item => item.attributes.day !== null)
          .map(item => item.attributes),
        'day',
        false
      );
  } else {
    sortedData = [{ value: data.attributes.value }];
  }
  return sortedData;
});

export const parseData = createSelector([filterData], data => {
  if (!data || data.length <= 1) return null;
  return data;
});

export const parseConfig = createSelector(
  [parseData, getColors, getMinimalist],
  (data, colors, minimalist) => {
    if (!data || !data.length) return null;

    let config = {
      height: 250,
      gradients: [
        {
          attributes: {
            id: 'firesGradient',
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '0%'
          },
          stops: [
            {
              offset: '0%',
              stopColor: colors.main,
              stopOpacity: '0'
            },
            {
              offset: '100%',
              stopColor: colors.main
            }
          ]
        }
      ],
      xKey: 'day',
      yKeys: {
        lines: {
          value: {
            stroke: 'url(#firesGradient)',
            type: 'monotone'
          }
        }
      },
      xAxis: {
        tickCount: 2,
        interval: data.length - 2,
        padding: { right: 8 },
        tickFormatter: t => moment(t).format('Do MMM')
      },
      tooltip: [
        {
          key: 'value'
        }
      ]
    };
    if (minimalist) {
      config = {
        ...config,
        height: 110,
        xAxis: {
          ...config.xAxis,
          tick: { fontSize: '10px', fill: '#aaaaaa' }
        }
      };
    }

    return config;
  }
);

export const getSentence = createSelector(
  [filterData, getCurrentLocation, getSentences],
  (data, currentLabel, sentences) => {
    const { initial } = sentences;
    const firesCount =
      (data &&
        data.map(item => item.value).reduce((sum, item) => sum + item)) ||
      'No';
    const params = {
      location: currentLabel,
      count: Number.isInteger(firesCount) ? format(',')(firesCount) : firesCount
    };
    return { sentence: initial, params };
  }
);
