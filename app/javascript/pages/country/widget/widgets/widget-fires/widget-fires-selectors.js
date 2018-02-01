import { createSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;
  return sortByKey(data.fires.map(item => item.attributes), 'day', false);
});

export const chartConfig = createSelector(
  [getSortedData, getColors],
  (data, colors) => {
    if (!data) return null;

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
              stopColor: colors.red,
              stopOpacity: '0'
            },
            {
              offset: '100%',
              stopColor: colors.red
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
        interval: 5,
        tickFormatter: t => moment(t).format('Do MMM')
      },
      tooltip: [
        {
          key: 'value'
        }
      ]
    };
  }
);

export const getSentence = createSelector(
  [getSortedData, getLocationNames],
  (data, locationNames) => {
    if (!data || !data.length) return '';

    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const firesCount =
      data.map(item => item.value).reduce((sum, item) => sum + item) || 'no';
    const sentence = `In <b>${currentLocation}</b> there were <b>${format(',')(
      firesCount
    )}</b> active fires detected in the last 7 days.`;

    return sentence;
  }
);
