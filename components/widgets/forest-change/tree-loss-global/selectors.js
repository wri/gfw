import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sum from 'lodash/sum';
import groupBy from 'lodash/groupBy';
import { formatNumber } from 'utils/format';
import moment from 'moment';
import { getColorPalette } from 'components/widgets/utils/colors';
import sortBy from 'lodash/sortBy';
import { yearTicksFormatter } from 'components/widgets/utils/data';

// get list data
const getLoss = (state) => state.data && state.data.loss;
const getExtent = (state) => state.data && state.data.extent;
const getSettings = (state) => state.settings;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentences = (state) => state && state.sentence;
const getCountries = (state) => state.locationData;

export const parsePayload = (payload) => {
  const { year } = payload?.[0]?.payload || {};

  return {
    startDate: moment(year).startOf('year').format('YYYY-MM-DD'),
    endDate: moment(year).endOf('year').format('YYYY-MM-DD'),
  };
};

const groupData = (data) => {
  const groupByYear = groupBy(data, 'year');
  const sumData = Object.keys(groupBy(data, 'year')).map((y) => {
    const area = sumBy(groupByYear[y], 'area') || 0;
    const emissions = sumBy(groupByYear[y], 'emissions') || 0;
    return {
      iso: 'Other',
      year: y,
      area,
      emissions,
    };
  });
  return sumData;
};

export const getFilteredData = createSelector(
  [getLoss, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter((d) => d.year >= startYear && d.year <= endYear);
  }
);

export const getTopIsos = createSelector([getFilteredData], (data) => {
  if (isEmpty(data)) return null;
  const groupedLoss = groupBy(sortBy(data, 'area').reverse(), 'iso');
  const sortedLoss = sortBy(
    Object.keys(groupedLoss).map((k) => ({
      iso: k,
      area: sumBy(groupedLoss[k], 'area') || 0,
    })),
    'area'
  )
    .reverse()
    .slice(0, 5);
  return sortedLoss.map((d) => d.iso);
});

// get lists selected
export const parseData = createSelector(
  [getFilteredData, getTopIsos],
  (data, isos) => {
    if (isEmpty(data)) return null;

    const allCountries = Object.keys(groupBy(data, 'iso'));
    const topData = data.filter((d) => isos.indexOf(d.iso) > -1);
    let otherData = [];
    if (allCountries && allCountries.length > 5) {
      otherData = groupData(data.filter((d) => isos.indexOf(d.iso) === -1));
    }
    const allData = [...topData, ...otherData];
    const groupedData = groupBy(allData, 'year');

    return Object.keys(groupedData).map((y) => {
      const datakeys = {};
      groupedData[y].forEach((d) => {
        datakeys[d.iso] = d.area || 0;
      });

      return {
        year: y,
        ...datakeys,
        total: sum(Object.values(datakeys)),
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
        stackId: 1,
      };
    });
    let tooltip = [
      {
        key: 'year',
      },
      {
        key: 'total',
        label: 'Total',
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
    ];
    tooltip = tooltip.concat(
      keys
        .map((key, i) => {
          const country =
            countries && Object.values(countries).find((c) => c.value === key);
          return {
            key,
            label: (country && country.label) || 'Other',
            color: colorRange[i],
            unitFormat: (value) =>
              formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
          };
        })
        .reverse()
    );

    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: yKeys,
      },
      xAxis: {
        tickFormatter: yearTicksFormatter,
      },
      unit: 'ha',
      tooltip,
    };
  }
);

export const parseSentence = createSelector(
  [
    getFilteredData,
    getExtent,
    getSettings,
    getLocationLabel,
    getIndicator,
    getSentences,
  ],
  (data, extentData, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const { initial, withInd } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalExtent =
      (extentData && extentData.length && sumBy(extentData, 'extent')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && totalExtent && (totalLoss / totalExtent) * 100) || 0;

    const sentence = indicator ? withInd : initial;

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel === 'global' ? 'globally' : locationLabel,
      startYear,
      endYear,
      loss: formatNumber({ num: totalLoss, unit: 'ha', spaceUnit: true }),
      percent: formatNumber({ num: percentageLoss, unit: '%' }),
      emissions: formatNumber({
        num: totalEmissions,
        unit: 't',
        spaceUnit: true,
      }),
      extentYear,
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
