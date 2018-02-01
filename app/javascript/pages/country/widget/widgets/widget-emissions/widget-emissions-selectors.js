import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { getColorPalette } from 'utils/data';

const EMISSIONS_KEYS = [
  'Total including LUCF',
  'Land-Use Change and Forestry',
  'Agriculture'
];

// get list data
const getData = state => state.data || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

const getSortedData = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;

  const sortedData = {
    data: [],
    total: {}
  };
  Object.keys(data)
    .filter(key => EMISSIONS_KEYS.includes(data[key].sector))
    .forEach(key => {
      if (data[key].sector === 'Total including LUCF') {
        sortedData.total = data[key];
      } else {
        sortedData.data.push(data[key]);
      }
    });
  return sortedData;
});

export const getChartData = createSelector([getSortedData], sortedData => {
  if (!sortedData || !sortedData.data.length) return null;

  const { data, total } = sortedData;
  const chartData = [];
  data[0].emissions.forEach((item, i) => {
    chartData.push({
      year: item.year,
      e1Value: item.value,
      e1Percentage: item.value / total.emissions[i].value * 100,
      e2Value: data[1].emissions[i].value,
      e2Percentage: data[1].emissions[i].value / total.emissions[i].value * 100
    });
  });
  return chartData;
});

export const chartConfig = createSelector(
  [getChartData, getColors],
  (data, colors) => {
    if (!data) return null;

    const colorRange = getColorPalette(colors.ramp, 2);
    return {
      xKey: 'year',
      yKeys: {
        areas: {
          e1Value: {
            fill: colorRange[0],
            stroke: colorRange[0],
            opacity: 1,
            strokeWidth: 0,
            background: false,
            activeDot: false
          },
          e2Value: {
            fill: colorRange[1],
            stroke: colorRange[1],
            opacity: 1,
            strokeWidth: 0,
            background: false,
            activeDot: false
          }
        }
      },
      tooltip: [
        {
          key: 'e1Percentage',
          unit: '%',
          label: 'Agriculture',
          color: colorRange[0]
        },
        {
          key: 'e2Percentage',
          unit: '%',
          label: 'Land-Use Change and Forestry',
          color: colorRange[1]
        }
      ]
    };
  }
);

export const getSentence = createSelector(
  [getSortedData, getLocationNames],
  (sortedData, locationNames) => {
    if (!sortedData || !sortedData.data.length) return '';

    const { data, total } = sortedData;
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const emissionsCount = data.reduce((accumulator, item) => {
      const accumulatorCount =
        typeof accumulator !== 'object'
          ? accumulator
          : accumulator.emissions
            .map(a => a.value)
            .reduce((iSum, value) => iSum + value);
      const itemCount = item.emissions
        .map(a => a.value)
        .reduce((iSum, value) => iSum + value);
      return accumulatorCount + itemCount;
    });
    const totalEmissionsCount = total.emissions.reduce(
      (accumulator, item) =>
        (typeof accumulator !== 'object' ? accumulator : accumulator.value) +
        item.value
    );
    const emissionFraction = emissionsCount / totalEmissionsCount * 100;
    const sentence = `In <b>${currentLocation}</b>, land-use change and forestry combined with agriculture contributed <b>${format(
      '.3s'
    )(emissionsCount)}tCO₂e</b> of emissions emissions from <b>${
      data[0].emissions[0].year
    }–${data[0].emissions[data[0].emissions.length - 1].year}</b>, <b>${format(
      '.0f'
    )(
      emissionFraction
    )}%</b> of <b>${currentLocation}'s</b> total over this period.`;

    return sentence;
  }
);
