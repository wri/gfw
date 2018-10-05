import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';
import { formatUSD } from 'utils/format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationsMeta = state => state.countries || null;
const getCurrentLocation = state => state.currentLocation;
const getColors = state => state.colors;
const getSentences = state => state.config.sentence;

// get lists selected
export const getFilteredData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;

    const { year } = settings;
    const gdps = data.filter(
      item =>
        item.gdpusd2012 &&
        item.gdpusd2012 !== '' &&
        item.gdpusd2012 !== '-9999' &&
        item.year === 9999
    );

    return data
      .filter(
        d =>
          d.country !== 'LBN' &&
          d.usdrev !== null &&
          d.usdexp !== null &&
          d.usdexp !== '' &&
          d.year === year
      )
      .map(item => {
        const usdexp = parseInt(item.usdexp, 10);
        const net = (item.usdrev - usdexp) * 1000;
        const countryGdp = gdps.filter(d => d.country === item.country);
        const gdp = countryGdp.length
          ? parseFloat(countryGdp[0].gdpusd2012)
          : 0;
        return {
          iso: item.country,
          rev: item.usdrev * 1000,
          exp: usdexp * 1000,
          net_usd: net,
          net_perc: gdp ? net / gdp * 100 : 0,
          gdp,
          year: item.year
        };
      });
  }
);

export const getSortedData = createSelector(
  [getFilteredData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;

    const { unit } = settings;
    return sortByKey(data, unit, true).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const chartData = createSelector(
  [getFilteredData, getSettings, getCurrentLocation, getColors],
  (filteredData, settings, currentLocation, colors) => {
    if (!filteredData || !filteredData.length) return null;

    const data = filteredData.filter(
      item => item.iso === currentLocation.value
    );
    if (!data.length) return null;

    return [
      {
        ...data[0],
        name: 'Expenditure',
        value: data[0].exp,
        color: colors.male
      },
      {
        ...data[0],
        name: 'Revenue',
        value: data[0].rev,
        color: colors.female
      }
    ];
  }
);

export const rankData = createSelector(
  [getSortedData, getSettings, getLocationsMeta, getCurrentLocation, getColors],
  (data, settings, meta, currentLocation, colors) => {
    if (!data || !data.length) return null;

    const locationIndex = findIndex(data, d => d.iso === currentLocation.value);
    let trimStart = locationIndex - 2;
    let trimEnd = locationIndex + 3;
    if (locationIndex < 2) {
      trimStart = 0;
      trimEnd = 5;
    }
    if (locationIndex > data.length - 3) {
      trimStart = data.length - 5;
      trimEnd = data.length;
    }
    const dataTrimmed = data.slice(trimStart, trimEnd);
    return dataTrimmed.map(d => {
      const locationData = meta && meta.find(l => d.iso === l.value);
      return {
        ...d,
        label: (locationData && locationData.label) || '',
        color: colors.main,
        path: `/dashboards/country/${d.iso}`,
        value: settings.unit === 'net_usd' ? d.net_usd : d.net_perc
      };
    });
  }
);

export const parseData = createSelector(
  [chartData, rankData],
  (data, rankedData) => {
    if (!data || !rankedData) return null;
    return {
      chartData: data,
      rankedData
    };
  }
);

export const parseConfig = () => ({
  yKeys: {
    bars: {
      value: {
        itemColor: true
      }
    }
  },
  xKey: 'name',
  tooltip: [
    {
      key: 'value',
      unit: ' USD',
      unitFormat: value => formatUSD(value, false)
    }
  ],
  unit: ' $',
  unitFormat: value => formatUSD(value)
});

export const getSentence = createSelector(
  [getFilteredData, getSettings, getCurrentLocation, getSentences],
  (data, settings, currentLocation, sentence) => {
    if (!data) return null;
    const selectedFAO = data.filter(item => item.iso === currentLocation.value);
    if (!selectedFAO.length) return '';

    const params = {
      location: `${currentLocation && currentLocation.label}'s`,
      value: `${formatUSD(selectedFAO[0].net_usd, false)} USD`,
      percentage:
        selectedFAO[0].net_perc >= 0.1
          ? `${format('2r')(selectedFAO[0].net_perc)}%`
          : '< 0.1%',
      year: settings.year
    };
    return {
      sentence,
      params
    };
  }
);
