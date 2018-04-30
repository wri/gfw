import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getActiveIndicator = state => state.activeIndicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getLoss, getExtent, getSettings],
  (data, extent, settings) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;

    return data
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        area: d.area || 0,
        emissions: d.emissions || 0,
        percentage: (d.area && d.area && d.area / extent * 100) || 0
      }));
  }
);

export const parseConfig = createSelector([getColors], colors => ({
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.main,
        background: false
      }
    }
  },
  xAxis: {
    tickFormatter: tick => {
      const year = moment(tick, 'YYYY');
      if ([2001, 2016].includes(tick)) {
        return year.format('YYYY');
      }
      return year.format('YY');
    }
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'year'
    },
    {
      key: 'area',
      unit: 'ha',
      unitFormat: value => format('.3s')(value)
    },
    {
      key: 'percentage',
      unit: '%',
      unitFormat: value => format('.1f')(value)
    }
  ]
}));

export const getSentence = createSelector(
  [
    parseData,
    getExtent,
    getSettings,
    getLocationNames,
    getActiveIndicator,
    getSentences
  ],
  (data, extent, settings, locationNames, indicator, sentences) => {
    if (!data) return null;
    const { initial, withIndicator, noLoss, noLossWithIndicator } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;

    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    let sentence = indicator.value === 'gadm28' ? initial : withIndicator;
    if (totalLoss === 0) {
      sentence = indicator.value === 'gadm28' ? noLoss : noLossWithIndicator;
    }

    const params = {
      indicator: indicator.label.toLowerCase(),
      location: locationLabel,
      startYear,
      endYear,
      loss: `${format('.3s')(totalLoss)}ha`,
      percent: `${format('.1f')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    return {
      sentence,
      params
    };
  }
);
