import { createSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'utils/data';
import { biomassToCO2 } from 'utils/calculations';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getTotalLoss = state => (state.data && state.data.totalLoss) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getLoss, getTotalLoss, getSettings],
  (loss, totalLoss, settings) => {
    if (!loss || !totalLoss) return null;
    const { startYear, endYear } = settings;
    const totalLossByYear = groupBy(totalLoss, 'year');
    return uniqBy(
      loss.filter(d => d.year >= startYear && d.year <= endYear).map(d => ({
        ...d,
        outsideAreaLoss: totalLossByYear[d.year][0].area - d.area,
        areaLoss: d.area || 0,
        totalLoss: totalLossByYear[d.year][0].area || 0,
        outsideCo2Loss: totalLossByYear[d.year][0].emissions - d.emissions,
        co2Loss: d.emissions || 0
      })),
      'year'
    );
  }
);

export const parseConfig = createSelector([getColors], colors => {
  const colorRange = getColorPalette(colors.ramp, 2);
  return {
    xKey: 'year',
    yKeys: {
      bars: {
        areaLoss: {
          fill: colorRange[0],
          stackId: 1
        },
        outsideAreaLoss: {
          fill: colorRange[1],
          stackId: 1
        }
      }
    },
    unit: 'ha',
    tooltip: [
      {
        key: 'outsideAreaLoss',
        label: 'Natural forest',
        color: colorRange[1],
        unit: 'ha',
        unitFormat: value => format('.3s')(value)
      },
      {
        key: 'areaLoss',
        label: 'Plantations',
        color: colorRange[0],
        unit: 'ha',
        unitFormat: value => format('.3s')(value)
      }
    ]
  };
});

export const getSentence = createSelector(
  [parseData, getSettings, getCurrentLocation, getSentences],
  (data, settings, currentLabel, sentences) => {
    if (!data) return null;
    const { initial } = sentences;
    const { startYear, endYear } = settings;
    const plantationsLoss = sumBy(data, 'areaLoss') || 0;
    const totalLoss = sumBy(data, 'totalLoss') || 0;
    const outsideLoss = sumBy(data, 'outsideAreaLoss') || 0;
    const outsideEmissions = sumBy(data, 'outsideCo2Loss') || 0;

    const lossPhrase =
      plantationsLoss > outsideLoss ? 'plantations' : 'natural forest';
    const percentage =
      plantationsLoss > outsideLoss
        ? 100 * plantationsLoss / totalLoss
        : 100 * outsideLoss / totalLoss;

    const sentence = initial;
    const params = {
      location: currentLabel,
      startYear,
      endYear,
      lossPhrase,
      value: `${format('.3s')(biomassToCO2(outsideEmissions))}t`,
      percentage: formatNumber({ num: percentage, unit: '%' })
    };

    return {
      sentence,
      params
    };
  }
);
