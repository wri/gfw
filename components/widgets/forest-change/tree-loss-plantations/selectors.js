import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'components/widgets/utils/colors';
import { zeroFillYears } from 'components/widgets/utils/data';

// get list data
const getLossPlantations = (state) => state.data && state.data.lossPlantations;
const getTotalLoss = (state) => state.data && state.data.totalLoss;
const getSettings = (state) => state.settings;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;

// get lists selected
export const parseData = createSelector(
  [getLossPlantations, getTotalLoss, getSettings],
  (lossPlantations, totalLoss, settings) => {
    if (!lossPlantations || !totalLoss) return null;
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    const zeroFilledData = zeroFillYears(
      lossPlantations,
      startYear,
      endYear,
      years,
      fillObj
    );
    const totalLossByYear = groupBy(totalLoss, 'year');
    const parsedData = uniqBy(
      zeroFilledData
        .filter((d) => d.year >= startYear && d.year <= endYear)
        .map((d) => {
          const groupedPlantations = groupBy(lossPlantations, 'year')[d.year];
          const summedPlatationsLoss =
            (groupedPlantations && sumBy(groupedPlantations, 'area')) || 0;
          const summedPlatationsEmissions =
            (groupedPlantations && sumBy(groupedPlantations, 'emissions')) || 0;
          const totalLossForYear =
            (totalLossByYear[d.year] && totalLossByYear[d.year][0]) || {};

          const returnData = {
            ...d,
            outsideAreaLoss: totalLossForYear.area - summedPlatationsLoss,
            areaLoss: summedPlatationsLoss || 0,
            totalLoss: totalLossForYear.area || 0,
            outsideCo2Loss:
              totalLossByYear[d.year][0].emissions - summedPlatationsEmissions,
            co2Loss: summedPlatationsEmissions || 0,
          };
          return returnData;
        }),
      'year'
    );
    return parsedData;
  }
);

export const parseConfig = createSelector([getColors], (colors) => {
  const colorRange = getColorPalette(colors.ramp, 2);
  return {
    height: 250,
    xKey: 'year',
    yKeys: {
      bars: {
        areaLoss: {
          fill: colorRange[0],
          stackId: 1,
        },
        outsideAreaLoss: {
          fill: colorRange[1],
          stackId: 1,
        },
      },
    },
    unit: 'ha',
    tooltip: [
      {
        key: 'year',
      },
      {
        key: 'totalLoss',
        label: 'Total',
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
      {
        key: 'outsideAreaLoss',
        label: 'Natural forest',
        color: colorRange[1],
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
      {
        key: 'areaLoss',
        label: 'Plantations',
        color: colorRange[0],
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      },
    ],
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
        ? (100 * plantationsLoss) / totalLoss
        : (100 * outsideLoss) / totalLoss;
    const params = {
      location: locationName,
      startYear,
      endYear,
      lossPhrase,
      value: formatNumber({
        num: outsideEmissions,
        unit: 't',
        spaceUnit: true,
      }),
      percentage: formatNumber({ num: percentage, unit: '%' }),
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
