import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentence;
const getMinimalist = state => state.minimalist || false;

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

export const parseConfig = createSelector(
  [getColors, getMinimalist],
  (colors, minimalist) => {
    let config = {
      height: 250,
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
          if ([2001, 2017].includes(tick)) {
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
          unitFormat: value => format('.2r')(value)
        }
      ]
    };
    if (minimalist) {
      config = {
        ...config,
        yTicksHide: true,
        gridHide: true,
        height: 50,
        margin: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0
        },
        xAxis: {
          tickFormatter: tick => moment(tick, 'YYYY').format('YY'),
          tick: { fontSize: '10px', fill: '#aaaaaa' }
        }
      };
    }

    return config;
  }
);

export const parseSentence = createSelector(
  [
    parseData,
    getExtent,
    getSettings,
    getLocationName,
    getIndicator,
    getSentences
  ],
  (data, extent, settings, locationName, indicator, sentences) => {
    if (!data) return null;
    const { initial, withIndicator, noLoss, noLossWithIndicator } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;
    let sentence = indicator ? withIndicator : initial;
    if (totalLoss === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: locationName,
      startYear,
      endYear,
      loss:
        totalLoss < 1 && totalLoss > 0
          ? `${format('.3r')(totalLoss)}ha`
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

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
