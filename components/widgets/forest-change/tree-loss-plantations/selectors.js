import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import { formatNumber } from 'utils/format';
import { getColorPalette } from 'components/widgets/utils/colors';
import { zeroFillYearsFilter } from 'components/widgets/utils/data';

// get list data
const getTotalLoss = (state) => state.data && state.data.totalLoss;
const getSettings = (state) => state.settings;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;

// get lists selected
export const parseData = createSelector(
  [getTotalLoss, getSettings],
  (totalLoss, settings) => {
    if (!totalLoss) return null;
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    const zeroFilledData = zeroFillYearsFilter(
      totalLoss,
      startYear,
      endYear,
      years,
      fillObj
    );

    const mappedData = zeroFilledData.map((list) => {
      return {
        iso: list[0].iso,
        outsideAreaLoss: list[1].area || 0,
        outsideCo2Loss: list[1].emissions || 0,
        areaLoss: list[0].area,
        co2Loss: list[0].emissions,
        totalLoss: list[0].area || 0 + list[1].area || 0 + list[2].area || 0,
        year: list[0].year,
      };
    });

    const parsedData = uniqBy(mappedData, 'year');

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
        label: 'Non-natural forest',
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

    const lossPhrase = 'natural forest';
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
      totalLoss: formatNumber({ num: totalLoss, unit: 'ha' }),
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
