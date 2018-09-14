import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';
import { sortByKey, getColorPalette } from 'utils/data';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;
const getCountries = state => state.config && state.countries;

const groupData = data => {
  const groupByYear = groupBy(data, 'year');
  const sumData = Object.keys(groupBy(data, 'year')).map(y => {
    const area = sumBy(groupByYear[y], 'area') || 0;
    const emissions = sumBy(groupByYear[y], 'emissions') || 0;
    return {
      iso: 'Other',
      year: y,
      area,
      emissions
    };
  });
  return sumData;
};

export const getFilteredData = createSelector(
  [getLoss, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter(d => d.year >= startYear && d.year <= endYear);
  }
);

export const getTopIsos = createSelector([getFilteredData], data => {
  if (isEmpty(data)) return null;
  const groupedLoss = groupBy(sortByKey(data, 'area'), 'iso');
  const sortedLoss = sortByKey(
    Object.keys(groupedLoss).map(k => ({
      iso: k,
      area: sumBy(groupedLoss[k], 'area')
    })),
    'area',
    true
  ).slice(0, 5);
  return sortedLoss.map(d => d.iso);
});

// get lists selected
export const parseData = createSelector(
  [getFilteredData, getTopIsos],
  (data, isos) => {
    if (isEmpty(data)) return null;
    const allCountries = Object.keys(groupBy(data, 'iso'));
    const topData = data.filter(d => isos.indexOf(d.iso) > -1);
    let otherData = [];
    if (allCountries && allCountries.length > 5) {
      otherData = groupData(data.filter(d => isos.indexOf(d.iso) === -1));
    }
    const allData = [...topData, ...otherData];
    const groupedData = groupBy(allData, 'year');

    return Object.keys(groupedData).map(y => {
      const datakeys = {};
      groupedData[y].forEach(d => {
        datakeys[d.iso] = d.area || 0;
      });

      return {
        year: y,
        ...datakeys
      };
    });
  }
);

export const parseConfig = createSelector(
  [getColors, getFilteredData, getTopIsos, getCountries],
  (colors, data, isos, countries) => {
    if (isEmpty(data)) return null;
    const yKeys = {};
    const allCountries = Object.keys(groupBy(data, 'iso'));
    const keys =
      allCountries && allCountries.length > 5 ? [...isos, 'Other'] : isos;
    const colorRange = getColorPalette(colors.ramp, keys.length).reverse();
    keys.reverse().forEach((k, index) => {
      yKeys[k] = {
        fill: colorRange[index],
        stackId: 1
      };
    });
    let tooltip = [
      {
        key: 'year'
      }
    ];
    tooltip = tooltip.concat(
      keys
        .map((key, i) => {
          const country = countries && countries.find(c => c.value === key);
          return {
            key,
            label: (country && country.label) || 'Other',
            unit: 'ha',
            color: colorRange[i],
            unitFormat: value => format('.3s')(value)
          };
        })
        .reverse()
    );

    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: yKeys
      },
      xAxis: {
        tickFormatter: tick => {
          const year = moment(tick, 'YYYY');
          if ([2001, 2017].includes(tick)) {
            return year.format('YYYY');
          }
          return year.format('YY');
        }
      },
      unit: 'ha',
      tooltip
    };
  }
);

export const getSentence = createSelector(
  [
    getFilteredData,
    getExtent,
    getSettings,
    getCurrentLocation,
    getIndicator,
    getSentences
  ],
  (data, extent, settings, currentLabel, indicator, sentences) => {
    if (!data) return null;
    const { initial, withInd } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    const sentence = indicator ? withInd : initial;

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      startYear,
      endYear,
      loss:
        totalLoss < 1
          ? `${format('.3s')(totalLoss)}ha`
          : `${format('.3s')(totalLoss)}ha`,
      percent: `${format('.2r')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    return {
      sentence,
      params
    };
  }
);
