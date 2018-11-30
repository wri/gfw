import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'utils/data';
import { biomassToCO2 } from 'utils/calculations';

// get list data
const getLossPlantations = state =>
  (state.data && state.data.lossPlantations) || null;
const getTotalLoss = state => (state.data && state.data.totalLoss) || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentence = state => state.config && state.config.sentence;

// get lists selected
export const parseData = createSelector(
  [getLossPlantations, getTotalLoss, getSettings],
  (lossPlantations, totalLoss, settings) => {
    if (!lossPlantations || !totalLoss) return null;
    const { startYear, endYear } = settings;
    const totalLossByYear = groupBy(totalLoss, 'year');
    return uniqBy(
      lossPlantations
        .filter(d => d.year >= startYear && d.year <= endYear)
        .map(d => {
          const groupedPlantations = groupBy(lossPlantations, 'year')[d.year];
          const summedPlatationsLoss =
            groupedPlantations && sumBy(groupedPlantations, 'area');
          const summedPlatationsEmissions =
            groupedPlantations && sumBy(groupedPlantations, 'emissions');
          const totalLossForYear =
            (totalLossByYear[d.year] && totalLossByYear[d.year][0]) || {};

          const returnData = {
            ...d,
            outsideAreaLoss: totalLossForYear.area - summedPlatationsLoss,
            areaLoss: summedPlatationsLoss || 0,
            totalLoss: totalLossForYear || 0,
            outsideCo2Loss:
              totalLossByYear[d.year][0].emissions - summedPlatationsEmissions,
            co2Loss: summedPlatationsEmissions || 0
          };
          return returnData;
        }),
      'year'
    );
  }
);

export const parseConfig = createSelector([getColors], colors => {
  const colorRange = getColorPalette(colors.ramp, 2);
  return {
    height: 250,
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

export const parseSentence = createSelector(
  [parseData, getSettings, getLocationName, getSentence],
  (data, settings, locationName, sentence) => {
    if (!data) return null;
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

    const params = {
      location: locationName,
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

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
