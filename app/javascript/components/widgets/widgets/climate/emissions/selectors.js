import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'utils/data';
import { yearTicksFormatter } from 'components/widgets/utils/data';

const EMISSIONS_KEYS = ['Total including LUCF', 'Land-Use Change and Forestry'];

// get list data
const getData = state => state.data || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

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

export const parseData = createSelector([getSortedData], sortedData => {
  if (!sortedData || !sortedData.data.length) return null;

  const { data, total } = sortedData;
  const chartData = [];
  data[0].emissions.forEach((item, i) => {
    const e1Value = item.value;
    const totalEmissions = total.emissions[i].value;
    chartData.push({
      year: item.year,
      e1Value,
      e1Percentage: e1Value / totalEmissions * 100,
      total: totalEmissions
    });
  });
  return chartData;
});

export const parseConfig = createSelector([getColors], colors => {
  const colorRange = getColorPalette(colors.ramp, 2);

  return {
    height: 250,
    xKey: 'year',
    yKeys: {
      areas: {
        e1Value: {
          fill: colorRange[0],
          stroke: colorRange[0],
          opacity: 1,
          strokeWidth: 0,
          background: false,
          activeDot: false,
          stackId: 1
        }
      }
    },
    xAxis: {
      tickFormatter: yearTicksFormatter
    },
    unit: 'tCO₂e',
    tooltip: [
      {
        key: 'year'
      },
      {
        key: 'total',
        label: 'Total',
        unit: 'tCO₂e',
        unitFormat: num => formatNumber({ num })
      },
      {
        key: 'e1Percentage',
        label: 'Land-Use Change and Forestry',
        color: colorRange[0],
        unit: '%',
        unitFormat: value => format('.1f')(value)
      }
    ]
  };
});

export const parseSentence = createSelector(
  [getSortedData, getLocationName, getSentences],
  (sortedData, locationName, sentences) => {
    if (!sortedData || !sortedData.data.length) return '';
    const { positive, negative } = sentences;
    const { data, total } = sortedData;
    const emissionsCount = data[0].emissions
      .map(a => a.value)
      .reduce((iSum, value) => iSum + value);
    const totalEmissionsCount = total.emissions.reduce(
      (accumulator, item) =>
        (typeof accumulator !== 'object' ? accumulator : accumulator.value) +
        item.value
    );
    const startYear = data[0].emissions[0].year;
    const endYear = data[0].emissions[data[0].emissions.length - 1].year;
    const emissionFraction = emissionsCount / totalEmissionsCount * 100;
    const params = {
      location: locationName,
      location_alt: `${locationName}'s`,
      percentage:
        Math.abs(emissionFraction) < 0.1
          ? '< 0.1%'
          : `${format('.2r')(Math.abs(emissionFraction))}%`,
      value: `${format('.3s')(
        Math.abs(emissionsCount / (endYear - startYear))
      )}tCO₂e/yr`,
      startYear,
      endYear,
      type: emissionsCount >= 0 ? 'net source' : 'net sink'
    };

    const sentence = emissionsCount >= 0 ? positive : negative;

    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
