import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { buildDateArray } from 'utils/dates';

const getData = state => state.data && state.data.fires;
const getCurrentLocation = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const filterData = createSelector([getData], data => {
  if (typeof data === 'number') return data;
  if (!data || isEmpty(data)) return null;

  const startDate = moment().subtract(1, 'week');
  const endDate = moment();

  const weekData = buildDateArray(startDate, endDate).map(d => {
    const dayData = data.find(fd => moment(fd.date).format('YYYY-MM-DD') === d);

    return {
      day: dayData ? moment(dayData.date).format('YYYY-MM-DD') : d,
      count: dayData ? dayData.count : 0
    };
  });

  return weekData;
});

export const parseData = createSelector([filterData], data => {
  if (!data || data.length < 1) return null;
  return data;
});

export const parseConfig = createSelector(
  [parseData, getColors],
  (data, colors) => {
    if (!data || !data.length) return null;

    return {
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
          count: {
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
          key: 'day',
          unitFormat: value => moment(value).format('Do MMM YYYY')
        },
        {
          key: 'count',
          unitFormatter: value =>
            (Number.isInteger(value) ? format(',')(value) : value)
        }
      ]
    };
  }
);

export const parseSentence = createSelector(
  [filterData, getCurrentLocation, getSentences],
  (data, currentLabel, sentences) => {
    const { initial } = sentences;
    const firesCount =
      typeof data === 'number' ? data : (data && sumBy(data, 'count')) || 0;
    const count = firesCount > 0 ? firesCount : 'No';
    const params = {
      location: currentLabel,
      count: typeof count === 'number' ? format(',')(count) : count
    };

    return { sentence: initial, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
